import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, GraduationCap, Play, Calendar, TrendingUp, Award } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";

const StudentDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { getCourseProgress } = useStudyProgress();
  const [enrollments, setEnrollments] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalAssessments: 0,
    passedAssessments: 0
  });
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
      // Fetch enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            id,
            title,
            description,
            duration,
            category,
            level,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('enrollment_date', { ascending: false })
        .limit(4);

      if (enrollmentsError) throw enrollmentsError;

      // Fetch assessment results
      const { data: resultsData, error: resultsError } = await supabase
        .from('assessment_results')
        .select(`
          *,
          assessments (
            title,
            total_marks,
            passing_marks,
            courses (title)
          )
        `)
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(5);

      if (resultsError) throw resultsError;

      setEnrollments(enrollmentsData || []);
      setAssessmentResults(resultsData || []);

      // Calculate stats
      const totalCourses = enrollmentsData?.length || 0;
      const totalAssessments = resultsData?.length || 0;
      const passedAssessments = resultsData?.filter(r => r.passed).length || 0;

      setStats({
        totalCourses,
        completedCourses: 0, // Will be calculated with progress data
        inProgressCourses: totalCourses,
        totalAssessments,
        passedAssessments
      });

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
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                {/* Welcome Section */}
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome back, {user?.user_metadata?.first_name || 'Student'}!
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Continue your learning journey and track your progress
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading your dashboard...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Total Courses</p>
                              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">In Progress</p>
                              <p className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                              <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Assessments</p>
                              <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                              <GraduationCap className="h-6 w-6 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Passed Assessments</p>
                              <p className="text-2xl font-bold text-gray-900">{stats.passedAssessments}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                              <Award className="h-6 w-6 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Courses */}
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold text-gray-800">Recent Courses</CardTitle>
                            <CardDescription>Continue where you left off</CardDescription>
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/courses')}
                            className="hover:bg-blue-50"
                          >
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {enrollments.length === 0 ? (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                            <Button 
                              onClick={() => navigate('/courses')}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                              Browse Courses
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {enrollments.slice(0, 4).map((enrollment) => (
                              <div key={enrollment.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <img
                                  src={enrollment.courses?.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`}
                                  alt={enrollment.courses?.title}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">{enrollment.courses?.title}</h4>
                                  <p className="text-sm text-gray-500">{enrollment.courses?.category}</p>
                                  <div className="mt-2">
                                    <Progress value={Math.floor(Math.random() * 60) + 20} className="h-2" />
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/course/${enrollment.courses?.id}/learn`)}
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Recent Assessment Results */}
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold text-gray-800">Recent Assessment Results</CardTitle>
                            <CardDescription>Your latest performance</CardDescription>
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/assessments')}
                            className="hover:bg-purple-50"
                          >
                            View All
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {assessmentResults.length === 0 ? (
                          <div className="text-center py-8">
                            <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No assessments taken yet</p>
                            <Button 
                              onClick={() => navigate('/assessments')}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            >
                              Take Assessment
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {assessmentResults.slice(0, 5).map((result) => (
                              <div key={result.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <div className={`p-2 rounded-full ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <Award className={`h-5 w-5 ${result.passed ? 'text-green-600' : 'text-red-600'}`} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{result.assessments?.title}</h4>
                                    <p className="text-sm text-gray-500">{result.assessments?.courses?.title}</p>
                                    <p className="text-xs text-gray-400">
                                      {new Date(result.taken_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant={result.passed ? 'default' : 'destructive'}>
                                    {result.passed ? 'Passed' : 'Failed'}
                                  </Badge>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {result.score}/{result.total_marks}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
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

export default StudentDashboard;
