
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

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
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Assessments & Tests
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Take tests and track your performance
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading assessments...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Available Tests */}
                    <section>
                      <h3 className="text-xl font-semibold mb-4">Available Tests</h3>
                      {assessments.length === 0 ? (
                        <Card className="text-center py-12">
                          <CardContent>
                            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Tests Available</h3>
                            <p className="text-gray-600">There are no active assessments at the moment.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {assessments.map((assessment) => {
                            const status = getAssessmentStatus(assessment.id);
                            const score = getAssessmentScore(assessment.id);
                            
                            return (
                              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                                    <Badge 
                                      variant={
                                        status === 'passed' ? 'default' : 
                                        status === 'failed' ? 'destructive' : 'secondary'
                                      }
                                    >
                                      {status === 'not_taken' ? 'Available' : 
                                       status === 'passed' ? 'Passed' : 'Failed'}
                                    </Badge>
                                  </div>
                                  <CardDescription>{assessment.description}</CardDescription>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Course:</span>
                                      <span className="font-medium">{assessment.courses?.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Duration:</span>
                                      <span>{assessment.duration_minutes} minutes</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Marks:</span>
                                      <span>{assessment.total_marks}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Passing Marks:</span>
                                      <span>{assessment.passing_marks}</span>
                                    </div>
                                    {score && (
                                      <div className="flex justify-between">
                                        <span>Your Score:</span>
                                        <span className="font-medium">{score}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <Button 
                                    className="w-full"
                                    disabled={status === 'passed'}
                                  >
                                    {status === 'passed' ? 'Completed' : 
                                     status === 'failed' ? 'Retake Test' : 'Start Test'}
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </section>

                    {/* Test Results */}
                    {results.length > 0 && (
                      <section>
                        <h3 className="text-xl font-semibold mb-4">Test Results & Performance</h3>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5" />
                              Performance History
                            </CardTitle>
                            <CardDescription>Your test results and progress over time</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {results.map((result) => (
                                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div className="space-y-1">
                                    <h4 className="font-medium">{result.assessments?.title}</h4>
                                    <p className="text-sm text-gray-600">
                                      {result.assessments?.courses?.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Taken on: {new Date(result.taken_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right space-y-1">
                                    <div className="font-medium">
                                      {result.score}/{result.total_marks}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {Math.round((result.score / result.total_marks) * 100)}%
                                    </div>
                                    <Badge variant={result.passed ? "default" : "destructive"}>
                                      {result.passed ? "Passed" : "Failed"}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    )}
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
