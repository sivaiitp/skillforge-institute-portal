import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

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
            handleSubmitAssessment(true); // Auto-submit when time expires
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
      // Fetch assessment details
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      // Fetch questions with proper type casting
      const { data: questionsData, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('sort_order');

      if (questionsError) throw questionsError;
      
      // Transform the data to match our Question interface
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
      setTimeRemaining((assessmentData.duration_minutes || 60) * 60);
    } catch (error) {
      toast.error('Error loading assessment');
      console.error('Error:', error);
    }
  };

  const startAssessment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assessment_attempts')
        .insert([{
          assessment_id: assessmentId,
          user_id: user.id,
          total_marks: assessment?.total_marks || 0,
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

  const handleSubmitAssessment = async (isAutoSubmit = false) => {
    if (!attemptId || !user || !assessment) return;

    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const passed = score >= (assessment.passing_marks || 0);
      const timeSpent = ((assessment.duration_minutes || 60) * 60) - timeRemaining;

      // Update attempt
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

      // Update or create assessment result
      const { error: resultError } = await supabase
        .from('assessment_results')
        .upsert({
          assessment_id: assessmentId,
          user_id: user.id,
          score: score,
          total_marks: assessment.total_marks,
          passed: passed,
          taken_at: new Date().toISOString()
        });

      if (resultError) throw resultError;

      if (isAutoSubmit) {
        toast.warning('Time expired! Assessment submitted automatically.');
      } else {
        toast.success(passed ? 'Congratulations! You passed!' : 'Assessment submitted. Better luck next time!');
      }

      // Navigate to results
      navigate(`/assessment-result/${attemptId}`);
    } catch (error) {
      toast.error('Error submitting assessment');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  if (!assessment || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{assessment.title}</CardTitle>
          {assessment.description && (
            <p className="text-gray-600">{assessment.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-semibold">Duration</p>
                <p className="text-sm text-gray-600">{assessment.duration_minutes} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-semibold">Questions</p>
                <p className="text-sm text-gray-600">{questions.length} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-semibold">Passing Score</p>
                <p className="text-sm text-gray-600">{assessment.passing_marks}/{assessment.total_marks}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>You have {assessment.duration_minutes} minutes to complete this assessment</li>
              <li>You can navigate between questions using the navigation buttons</li>
              <li>Make sure to answer all questions before submitting</li>
              <li>The assessment will auto-submit when time expires</li>
            </ul>
          </div>

          <Button 
            onClick={startAssessment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            size="lg"
          >
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with timer and progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{assessment.title}</h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining < 300 ? "destructive" : "secondary"}>
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline">
                {answeredCount}/{questions.length} answered
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-800 leading-relaxed">{currentQuestion.question_text}</p>

          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <RadioGroup 
              value={answers[currentQuestion.id] || ''} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'true_false' && (
            <RadioGroup 
              value={answers[currentQuestion.id] || ''} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'short_answer' && (
            <Input
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Enter your answer..."
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={() => handleSubmitAssessment()}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTaking;
