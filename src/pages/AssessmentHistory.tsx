
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import AssessmentHistoryTable from '@/components/assessments/AssessmentHistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  passing_marks: number;
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
        .select('id, title, description, passing_marks')
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

  const getStats = () => {
    if (history.length === 0) return { totalAttempts: 0, bestScore: 0, averageScore: 0, passRate: 0 };
    
    const totalAttempts = history.length;
    const bestScore = Math.max(...history.map(h => (h.score / h.total_marks) * 100));
    const averageScore = history.reduce((sum, h) => sum + (h.score / h.total_marks) * 100, 0) / totalAttempts;
    const passedAttempts = history.filter(h => h.passed).length;
    const passRate = (passedAttempts / totalAttempts) * 100;

    return { totalAttempts, bestScore, averageScore, passRate };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to view assessment history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium text-lg">Loading assessment history...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-white/80 border-gray-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Assessment History</h1>
                    <p className="text-gray-600 mt-1">Track your progress and performance over time</p>
                  </div>
                </div>
                
                {assessment && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{assessment.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{assessment.description}</p>
                    <div className="mt-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Passing Score: {assessment.passing_marks} marks
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Best Score</p>
                    <p className="text-3xl font-bold text-green-600">{stats.bestScore.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.averageScore.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-white/20 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.passRate.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History Table */}
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
