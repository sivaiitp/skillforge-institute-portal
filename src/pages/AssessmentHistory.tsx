
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import AssessmentHistoryTable from '@/components/assessments/AssessmentHistoryTable';

interface AssessmentHistoryItem {
  id: string;
  attempt_number: number;
  score: number;
  total_marks: number;
  passed: boolean;
  time_spent: number;
  completed_at: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
}

const AssessmentHistory = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !assessmentId) {
      navigate('/');
      return;
    }
    fetchAssessmentHistory();
  }, [user, assessmentId]);

  const fetchAssessmentHistory = async () => {
    try {
      setLoading(true);

      // Fetch assessment details
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('id, title, description')
        .eq('id', assessmentId)
        .single();

      if (assessmentError) throw assessmentError;
      setAssessment(assessmentData);

      // Fetch history
      const { data: historyData, error: historyError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user!.id)
        .eq('assessment_id', assessmentId)
        .order('completed_at', { ascending: false });

      if (historyError) throw historyError;
      setHistory(historyData || []);
    } catch (error) {
      toast.error('Error loading assessment history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view assessment history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assessment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessment History</h1>
            <p className="text-gray-600 mt-1">
              View all your attempts for this assessment
            </p>
          </div>
        </div>

        {assessment && (
          <AssessmentHistoryTable 
            history={history} 
            assessmentTitle={assessment.title}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentHistory;
