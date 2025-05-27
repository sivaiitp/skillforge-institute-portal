
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { XCircle, ArrowLeft } from 'lucide-react';
import AssessmentResultSummary from '@/components/assessments/AssessmentResultSummary';
import AssessmentStatsGrid from '@/components/assessments/AssessmentStatsGrid';
import AssessmentDetailedReview from '@/components/assessments/AssessmentDetailedReview';

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
      
      // Transform the data to match our interface
      const transformedAttempt: AssessmentAttempt = {
        id: attemptData.id,
        assessment_id: attemptData.assessment_id,
        score: attemptData.score,
        total_marks: attemptData.total_marks,
        passed: attemptData.passed,
        time_spent: attemptData.time_spent,
        answers: (attemptData.answers as Record<string, string>) || {},
        completed_at: attemptData.completed_at,
        assessments: {
          title: attemptData.assessments.title,
          description: attemptData.assessments.description,
          passing_marks: attemptData.assessments.passing_marks,
          courses: attemptData.assessments.courses
        }
      };
      
      setAttempt(transformedAttempt);

      // Fetch questions for detailed review
      const { data: questionsData, error: questionsError } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', attemptData.assessment_id)
        .order('sort_order');

      if (questionsError) throw questionsError;
      
      // Transform the questions data
      const transformedQuestions: Question[] = (questionsData || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ? (q.options as string[]) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points: q.points
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      toast.error('Error loading assessment result');
      console.error('Error:', error);
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
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
        <AssessmentResultSummary attempt={attempt} userRole={userRole} />

        {/* Stats Grid - Include in the summary card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <AssessmentStatsGrid attempt={attempt} questions={questions} />
          </CardContent>
        </Card>

        {/* Detailed Review */}
        <AssessmentDetailedReview attempt={attempt} questions={questions} />
      </div>
    </div>
  );
};

export default AssessmentResult;
