import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, FileText, Timer } from 'lucide-react';
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
          <p className="text-gray-600 font-medium">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{assessment.title}</CardTitle>
          {assessment.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{assessment.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-8 px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Duration</p>
              <p className="text-gray-600 mt-1">{assessment.duration_minutes} minutes</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Questions</p>
              <p className="text-gray-600 mt-1">{questions.length} questions</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Passing Score</p>
              <p className="text-gray-600 mt-1">{assessment.passing_marks}/{assessment.total_marks}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
              Assessment Instructions
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>You have {assessment.duration_minutes} minutes to complete this assessment</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>You can navigate between questions using the navigation buttons</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Make sure to answer all questions before submitting</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>The assessment will auto-submit when time expires</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={startAssessment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            size="lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Enhanced Header with timer and progress */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{assessment.title}</h2>
              <p className="text-gray-600 mt-1">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-gray-500" />
                <Badge 
                  variant={timeRemaining < 300 ? "destructive" : "secondary"}
                  className="text-lg px-4 py-2 font-mono"
                >
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {answeredCount}/{questions.length} answered
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Question Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-start justify-between">
            <span className="leading-relaxed">Question {currentQuestionIndex + 1}</span>
            <Badge variant="secondary" className="text-lg px-4 py-2 font-semibold">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="prose max-w-none">
            <p className="text-xl leading-relaxed text-gray-800 font-medium">
              {currentQuestion.question_text}
            </p>
          </div>

          <div className="space-y-4">
            {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
              <RadioGroup 
                value={answers[currentQuestion.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`}
                        className="mt-1 w-5 h-5"
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 text-lg leading-relaxed cursor-pointer text-gray-700 group-hover:text-gray-900"
                      >
                        <span className="font-medium text-gray-500 mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.question_type === 'true_false' && (
              <RadioGroup 
                value={answers[currentQuestion.id] || ''} 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-4"
              >
                <div className="group">
                  <div className="flex items-start space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="true" id="true" className="mt-1 w-5 h-5" />
                    <Label htmlFor="true" className="flex-1 text-lg cursor-pointer text-gray-700 group-hover:text-gray-900">
                      <span className="font-medium text-gray-500 mr-3">A.</span>
                      True
                    </Label>
                  </div>
                </div>
                <div className="group">
                  <div className="flex items-start space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem value="false" id="false" className="mt-1 w-5 h-5" />
                    <Label htmlFor="false" className="flex-1 text-lg cursor-pointer text-gray-700 group-hover:text-gray-900">
                      <span className="font-medium text-gray-500 mr-3">B.</span>
                      False
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.question_type === 'short_answer' && (
              <div className="space-y-3">
                <Label htmlFor="answer-input" className="text-lg font-medium text-gray-700">
                  Your Answer
                </Label>
                <Input
                  id="answer-input"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="text-lg p-4 border-2 focus:border-blue-500 rounded-xl"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={() => handleSubmitAssessment()}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Assessment
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentTaking;
