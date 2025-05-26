import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, ClipboardList, TrendingUp, GraduationCap, Target, Calendar } from "lucide-react";
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
      // Fetch certificates
      const { data: certsData } = await supabase
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading your dashboard...</p>
                  </div>
                ) : (
                  <>
                    {/* Welcome Section */}
                    <div className="text-center space-y-4 mb-12">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome back!
                      </h2>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Continue your learning journey and track your progress
                      </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                          <CardTitle className="text-sm font-medium text-blue-100">Active Courses</CardTitle>
                          <BookOpen className="h-6 w-6 text-blue-200" />
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="text-3xl font-bold">{enrollments.length}</div>
                          <p className="text-xs text-blue-200">Currently enrolled</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                          <CardTitle className="text-sm font-medium text-emerald-100">Certificates Earned</CardTitle>
                          <Award className="h-6 w-6 text-emerald-200" />
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="text-3xl font-bold">{certificates.length}</div>
                          <p className="text-xs text-emerald-200">Completed courses</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                          <CardTitle className="text-sm font-medium text-purple-100">Recent Tests</CardTitle>
                          <Target className="h-6 w-6 text-purple-200" />
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="text-3xl font-bold">{assessments.length}</div>
                          <p className="text-xs text-purple-200">Assessments taken</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Current Courses */}
                      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-3">
                            <BookOpen className="h-6 w-6" />
                            Current Courses
                          </CardTitle>
                          <CardDescription className="text-blue-100">Your active enrollments</CardDescription>
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
                                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
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
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recent Certificates */}
                      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-3">
                            <Award className="h-6 w-6" />
                            Recent Certificates
                          </CardTitle>
                          <CardDescription className="text-emerald-100">Your latest achievements</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          {certificates.length === 0 ? (
                            <div className="text-center py-8">
                              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-500">No certificates earned yet</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {certificates.map((cert) => (
                                <div key={cert.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all duration-200">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                      <Award className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800">{cert.courses?.title}</h4>
                                      <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                    Certified
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Test Results */}
                    {assessments.length > 0 && (
                      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                          <CardTitle className="flex items-center gap-3">
                            <TrendingUp className="h-6 w-6" />
                            Recent Test Results
                          </CardTitle>
                          <CardDescription className="text-purple-100">Your latest assessment performance</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {assessments.map((result) => (
                              <div key={result.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
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
                                <Badge variant={result.passed ? "default" : "destructive"} className={result.passed ? "bg-emerald-100 text-emerald-800 border-emerald-200" : ""}>
                                  {result.passed ? "Passed" : "Failed"}
                                </Badge>
                              </div>
                            ))}
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
