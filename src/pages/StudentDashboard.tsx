
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, ClipboardList, TrendingUp, GraduationCap, Target, Calendar, ExternalLink, User, CreditCard, FileText } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [assessments, setAssessments] = useState([]);
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
    
    fetchDashboardData();
  }, [user, userRole, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch certificates using type assertion
      const { data: certsData } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (title, certification, description)
        `)
        .eq('user_id', user.id)
        .eq('is_valid', true)
        .order('issued_date', { ascending: false })
        .limit(3);

      // Fetch enrollments
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (title, description, duration, category)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('enrollment_date', { ascending: false })
        .limit(3);

      // Fetch recent assessment results
      const { data: assessData } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessments (title, total_marks, passing_marks)
        `)
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(3);

      setCertificates(certsData || []);
      setEnrollments(enrollData || []);
      setAssessments(assessData || []);
    } catch (error) {
      toast.error('Error fetching dashboard data');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Student Dashboard
                </h1>
              </div>
            </header>
            
            <div className="p-6">
              <div className="max-w-7xl mx-auto space-y-8">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading your dashboard...</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                              <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome back!</h1>
                              <p className="text-gray-600">Continue your learning journey and track your progress</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => navigate('/courses')} 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Browse Courses
                          </Button>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/courses')}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-blue-700 text-sm font-medium">Active Courses</p>
                                <p className="text-2xl font-bold text-gray-800">{enrollments.length}</p>
                              </div>
                              <BookOpen className="w-8 h-8 text-blue-500" />
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/certificates')}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-green-700 text-sm font-medium">Certificates</p>
                                <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
                              </div>
                              <Award className="w-8 h-8 text-green-500" />
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/dashboard/assessments')}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-purple-700 text-sm font-medium">Recent Tests</p>
                                <p className="text-2xl font-bold text-gray-800">{assessments.length}</p>
                              </div>
                              <Target className="w-8 h-8 text-purple-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Courses */}
                      <Card className="shadow-sm border bg-white">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Current Courses
                          </CardTitle>
                          <CardDescription>Your active enrollments</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          {enrollments.length === 0 ? (
                            <div className="text-center py-8">
                              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">No active courses yet</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                      <BookOpen className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800">{enrollment.courses?.title}</h4>
                                      <p className="text-sm text-gray-600">{enrollment.courses?.duration}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                                    {enrollment.courses?.category}
                                  </Badge>
                                </div>
                              ))}
                              <Button 
                                variant="outline"
                                className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() => navigate('/dashboard/courses')}
                              >
                                View All Courses
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recent Certificates */}
                      <Card className="shadow-sm border bg-white">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                          <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            Recent Certificates
                          </CardTitle>
                          <CardDescription>Your latest achievements</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          {certificates.length === 0 ? (
                            <div className="text-center py-8">
                              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">No certificates earned yet</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {certificates.map((cert: any) => (
                                <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                      <Award className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800">{cert.courses?.title}</h4>
                                      <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    Certified
                                  </Badge>
                                </div>
                              ))}
                              <Button 
                                variant="outline"
                                className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50"
                                onClick={() => navigate('/dashboard/certificates')}
                              >
                                View All Certificates
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Test Results */}
                    {assessments.length > 0 && (
                      <Card className="shadow-sm border bg-white mt-6">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            Recent Test Results
                          </CardTitle>
                          <CardDescription>Your latest assessment performance</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {assessments.map((result) => (
                              <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <ClipboardList className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800">{result.assessments?.title}</h4>
                                    <p className="text-sm text-gray-600">
                                      Score: {result.score}/{result.total_marks} ({Math.round((result.score / result.total_marks) * 100)}%)
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={result.passed ? "default" : "destructive"} className={result.passed ? "bg-green-100 text-green-800 border-green-200" : ""}>
                                  {result.passed ? "Passed" : "Failed"}
                                </Badge>
                              </div>
                            ))}
                            <Button 
                              variant="outline"
                              className="w-full mt-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                              onClick={() => navigate('/dashboard/assessments')}
                            >
                              View All Assessments
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentDashboard;
