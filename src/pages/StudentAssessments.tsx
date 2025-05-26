
import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { AssessmentsHeader } from "@/components/assessments/AssessmentsHeader";
import { AvailableAssessments } from "@/components/assessments/AvailableAssessments";
import { AssessmentResults } from "@/components/assessments/AssessmentResults";

const StudentAssessments = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchAssessments();
  }, [user, userRole, navigate]);

  const fetchAssessments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch available assessments
      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select(`
          *,
          courses (title, category)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (assessmentsError) throw assessmentsError;

      // Fetch user's assessment results
      const { data: resultsData, error: resultsError } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessments (
            title,
            total_marks,
            passing_marks,
            courses (title, category)
          )
        `)
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false });

      if (resultsError) throw resultsError;

      setAssessments(assessmentsData || []);
      setResults(resultsData || []);
    } catch (error) {
      toast.error('Error fetching assessments');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const getAssessmentStatus = (assessmentId: string) => {
    const result = results.find(r => r.assessment_id === assessmentId);
    if (!result) return 'not_taken';
    return result.passed ? 'passed' : 'failed';
  };

  const getAssessmentScore = (assessmentId: string) => {
    const result = results.find(r => r.assessment_id === assessmentId);
    return result ? `${result.score}/${result.total_marks}` : null;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1 ml-64">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <ClipboardList className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Assessments
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <AssessmentsHeader />

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading assessments...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <AvailableAssessments
                      assessments={assessments}
                      getAssessmentStatus={getAssessmentStatus}
                      getAssessmentScore={getAssessmentScore}
                    />

                    <AssessmentResults results={results} />
                  </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentAssessments;
