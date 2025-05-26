
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, ClipboardList, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <Navigation />
      
      {/* Main Content Section */}
      <div className="flex-1">
        <SidebarProvider>
          <div className="flex min-h-full">
            {/* Sidebar */}
            <StudentSidebar />
            
            {/* Content Area */}
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </header>
              
              <div className="p-6 space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading dashboard...</p>
                  </div>
                ) : (
                  <>
                    {/* Welcome Section */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Welcome back!</h2>
                      <p className="text-gray-600">Here's your learning progress overview</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{enrollments.length}</div>
                          <p className="text-xs text-muted-foreground">Currently enrolled</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{certificates.length}</div>
                          <p className="text-xs text-muted-foreground">Completed courses</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Recent Tests</CardTitle>
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{assessments.length}</div>
                          <p className="text-xs text-muted-foreground">Assessments taken</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Courses */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Current Courses
                          </CardTitle>
                          <CardDescription>Your active enrollments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {enrollments.length === 0 ? (
                            <p className="text-sm text-gray-500">No active courses yet</p>
                          ) : (
                            <div className="space-y-3">
                              {enrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <h4 className="font-medium">{enrollment.courses?.title}</h4>
                                    <p className="text-sm text-gray-600">{enrollment.courses?.duration}</p>
                                  </div>
                                  <Badge variant="outline">{enrollment.courses?.category}</Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recent Certificates */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Recent Certificates
                          </CardTitle>
                          <CardDescription>Your latest achievements</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {certificates.length === 0 ? (
                            <p className="text-sm text-gray-500">No certificates earned yet</p>
                          ) : (
                            <div className="space-y-3">
                              {certificates.map((cert) => (
                                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <h4 className="font-medium">{cert.courses?.title}</h4>
                                    <p className="text-sm text-gray-600">
                                      Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">
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
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recent Test Results
                          </CardTitle>
                          <CardDescription>Your latest assessment performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {assessments.map((result) => (
                              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">{result.assessments?.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Score: {result.score}/{result.total_marks}
                                  </p>
                                </div>
                                <Badge variant={result.passed ? "default" : "destructive"}>
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
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default StudentDashboard;
