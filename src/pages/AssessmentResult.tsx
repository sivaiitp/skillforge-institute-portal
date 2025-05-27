
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Award, ArrowLeft, RotateCcw } from 'lucide-react';

interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  score: number;
  total_marks: number;
  passed: boolean;
  time_spent: number;
  answers: Record<string, string>;
  completed_at: string;
  assessments: {
    title: string;
    description: string;
    passing_marks: number;
    courses: { title: string } | null;
  };
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
}

const AssessmentResult = () => {
  const { attemptId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !attemptId) {
      navigate('/auth');
      return;
    }
    fetchAttemptData();
  }, [attemptId, user]);

  const fetchAttemptData = async () => {
    try {
      setLoading(true);

      // Fetch attempt with assessment details
      const { data: attemptData, error: attemptError } = await supabase
        .from('assessment_attempts')
        .select(`
          *,
          assessments (
            title,
            description,
            passing_marks,
            courses (title)
          )
        `)
        .eq('id', attemptId)
        .single();

      if (attemptError) throw attemptError;
      setAttempt(attemptData);

      // Fetch questions for detailed review
      const { data: questionsData, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', attemptData.assessment_id)
        .order('sort_order');

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);
    } catch (error) {
      toast.error('Error loading assessment result');
      console.error('Error:', error);
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getAnswerStatus = (question: Question) => {
    const userAnswer = attempt?.answers[question.id];
    const isCorrect = userAnswer && userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
    return { userAnswer, isCorrect };
  };

  const retakeAssessment = () => {
    navigate(`/take-assessment/${attempt?.assessment_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Result Not Found</h2>
            <p className="text-gray-600 mb-4">The assessment result could not be found.</p>
            <Button onClick={() => navigate('/assessments')}>
              Back to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = (attempt.score / attempt.total_marks) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(userRole === 'admin' ? '/admin/assessments' : '/assessments')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Assessment Result</h1>
        </div>

        {/* Result Summary */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {attempt.passed ? (
                <CheckCircle className="w-16 h-16 text-green-500" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {attempt.passed ? 'Congratulations!' : 'Keep Trying!'}
            </CardTitle>
            <p className="text-gray-600">{attempt.assessments.title}</p>
            {attempt.assessments.courses && (
              <Badge variant="outline">{attempt.assessments.courses.title}</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Score */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {attempt.score}/{attempt.total_marks}
                </div>
                <div className="text-xl text-gray-600 mb-4">
                  {percentage.toFixed(1)}%
                </div>
                <Progress value={percentage} className="h-3" />
                <p className="text-sm text-gray-500 mt-2">
                  Passing score: {attempt.assessments.passing_marks}/{attempt.total_marks} 
                  ({((attempt.assessments.passing_marks / attempt.total_marks) * 100).toFixed(1)}%)
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold">Time Taken</p>
                  <p className="text-blue-600">{formatTime(attempt.time_spent)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold">Correct Answers</p>
                  <p className="text-green-600">
                    {questions.filter(q => getAnswerStatus(q).isCorrect).length}/{questions.length}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-semibold">Status</p>
                  <Badge variant={attempt.passed ? "default" : "destructive"}>
                    {attempt.passed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                {!attempt.passed && (
                  <Button onClick={retakeAssessment} className="bg-gradient-to-r from-blue-500 to-indigo-500">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Assessment
                  </Button>
                )}
                {attempt.passed && userRole === 'student' && (
                  <Button onClick={() => navigate('/certificates')} className="bg-gradient-to-r from-green-500 to-emerald-500">
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Review */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>Detailed Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const { userAnswer, isCorrect } = getAnswerStatus(question);
                return (
                  <div key={question.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Question {index + 1}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={isCorrect ? "default" : "destructive"}>
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                        <span className="text-sm text-gray-500">{question.points} pts</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-800 mb-3">{question.question_text}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600 mb-1">Your Answer:</p>
                        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {userAnswer || "No answer provided"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <p className="text-green-600">{question.correct_answer}</p>
                      </div>
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                        <p className="text-blue-700 text-sm">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentResult;
