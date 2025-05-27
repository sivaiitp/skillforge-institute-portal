
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import AssessmentStartScreen from './AssessmentStartScreen';
import AssessmentProgressHeader from './AssessmentProgressHeader';
import QuestionDisplay from './QuestionDisplay';
import AssessmentNavigation from './AssessmentNavigation';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  sort_order: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
}

interface AssessmentTakingProps {
  assessmentId: string;
}

const AssessmentTaking = ({ assessmentId }: AssessmentTakingProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchAssessmentData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [assessmentId]);

  useEffect(() => {
    if (hasStarted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitAssessment(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasStarted, timeRemaining]);

  const fetchAssessmentData = async () => {
    try {
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (assessmentError) throw assessmentError;
      
      const { data: questionsData, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('sort_order');

      if (questionsError) throw questionsError;
      
      const transformedQuestions: Question[] = (questionsData || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ? (q.options as string[]) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        sort_order: q.sort_order
      }));
      
      setQuestions(transformedQuestions);
      
      const calculatedTotalMarks = transformedQuestions.reduce((sum, q) => sum + q.points, 0);
      const totalMarks = assessmentData.total_marks || calculatedTotalMarks;
      const passingMarks = assessmentData.passing_marks || Math.ceil(totalMarks * 0.6);
      
      setAssessment({
        ...assessmentData,
        total_marks: totalMarks,
        passing_marks: passingMarks,
        duration_minutes: assessmentData.duration_minutes || 60
      });
      
      setTimeRemaining((assessmentData.duration_minutes || 60) * 60);
    } catch (error) {
      toast.error('Error loading assessment');
      console.error('Error:', error);
    }
  };

  const startAssessment = async () => {
    if (!user || !assessment) return;

    try {
      const { data, error } = await supabase
        .from('assessment_attempts')
        .insert([{
          assessment_id: assessmentId,
          user_id: user.id,
          total_marks: assessment.total_marks,
          status: 'in_progress'
        }])
        .select()
        .single();

      if (error) throw error;
      setAttemptId(data.id);
      setHasStarted(true);
      toast.success('Assessment started! Good luck!');
    } catch (error) {
      toast.error('Error starting assessment');
      console.error('Error:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase() === question.correct_answer.toLowerCase()) {
        score += question.points;
      }
    });
    return score;
  };

  const getAttemptNumber = async () => {
    if (!user) return 1;
    
    const { data, error } = await supabase
      .from('assessment_history')
      .select('attempt_number')
      .eq('user_id', user.id)
      .eq('assessment_id', assessmentId)
      .order('attempt_number', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting attempt number:', error);
      return 1;
    }

    return data && data.length > 0 ? data[0].attempt_number + 1 : 1;
  };

  const handleSubmitAssessment = async (isAutoSubmit = false) => {
    if (!attemptId || !user || !assessment) return;

    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const passed = score >= assessment.passing_marks;
      const timeSpent = (assessment.duration_minutes * 60) - timeRemaining;
      const attemptNumber = await getAttemptNumber();

      const { error: updateError } = await supabase
        .from('assessment_attempts')
        .update({
          completed_at: new Date().toISOString(),
          time_spent: timeSpent,
          score: score,
          passed: passed,
          answers: answers,
          status: 'completed'
        })
        .eq('id', attemptId);

      if (updateError) throw updateError;

      // Save to assessment history
      const { error: historyError } = await supabase
        .from('assessment_history')
        .insert({
          user_id: user.id,
          assessment_id: assessmentId,
          attempt_number: attemptNumber,
          score: score,
          total_marks: assessment.total_marks,
          passed: passed,
          time_spent: timeSpent,
          answers: answers,
          started_at: new Date(Date.now() - timeSpent * 1000).toISOString(),
          completed_at: new Date().toISOString()
        });

      if (historyError) throw historyError;

      // Use upsert to handle both new results and updates for retakes
      const { error: resultError } = await supabase
        .from('assessment_results')
        .upsert({
          assessment_id: assessmentId,
          user_id: user.id,
          score: score,
          total_marks: assessment.total_marks,
          passed: passed,
          taken_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,assessment_id'
        });

      if (resultError) throw resultError;

      if (isAutoSubmit) {
        toast.warning('Time expired! Assessment submitted automatically.');
      } else {
        toast.success(passed ? 'Congratulations! You passed!' : 'Assessment submitted. Better luck next time!');
      }

      navigate(`/assessment-result/${attemptId}`);
    } catch (error) {
      toast.error('Error submitting assessment');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1));
  };

  if (!assessment || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <AssessmentStartScreen
        assessment={assessment}
        totalQuestions={questions.length}
        onStartAssessment={startAssessment}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AssessmentProgressHeader
        assessment={assessment}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        answeredCount={answeredCount}
      />

      <QuestionDisplay
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />

      <AssessmentNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={() => handleSubmitAssessment()}
      />
    </div>
  );
};

export default AssessmentTaking;
