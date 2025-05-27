
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, GraduationCap, Play, Calendar } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";

const StudentCourses = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { getCourseProgress } = useStudyProgress();
  const [enrollments, setEnrollments] = useState([]);
  const [courseProgressData, setCourseProgressData] = useState({});
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
    
    fetchEnrollments();
  }, [user, userRole, navigate]);

  const fetchEnrollments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
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
            image_url,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      
      const enrollmentData = data || [];
      setEnrollments(enrollmentData);
      
      // Calculate progress for each course
      const progressPromises = enrollmentData.map(async (enrollment) => {
        if (enrollment.courses?.id) {
          const progress = await getCourseProgress(enrollment.courses.id);
          return { courseId: enrollment.courses.id, progress };
        }
        return { courseId: null, progress: { percentage: 0 } };
      });
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap = {};
      progressResults.forEach(({ courseId, progress }) => {
        if (courseId) {
          progressMap[courseId] = progress;
        }
      });
      
      setCourseProgressData(progressMap);
    } catch (error) {
      toast.error('Error fetching courses');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const getEnrollmentProgress = (courseId) => {
    return courseProgressData[courseId]?.percentage || 0;
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
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Courses
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Enrolled Courses
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Track your learning progress and access course materials
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading your courses...</p>
                  </div>
                ) : enrollments.length === 0 ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Courses Yet</h3>
                      <p className="text-gray-600 mb-8 text-lg">You haven't enrolled in any courses yet.</p>
                      <Button 
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                      >
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800">Enrolled Courses ({enrollments.length})</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {enrollments.map((enrollment) => {
                        const courseProgress = getEnrollmentProgress(enrollment.courses?.id);
                        
                        return (
                          <div key={enrollment.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-6">
                              <div className="flex-shrink-0">
                                <img 
                                  src={enrollment.courses?.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                                  alt={enrollment.courses?.title}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{enrollment.courses?.title}</h4>
                                    <p className="text-gray-600 mb-3 line-clamp-2">{enrollment.courses?.description}</p>
                                    
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>{enrollment.courses?.duration}</span>
                                      </div>
                                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                        {enrollment.courses?.level}
                                      </Badge>
                                      <Badge 
                                        variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                                        className={enrollment.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                                      >
                                        {enrollment.status}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-700">Progress</span>
                                        <span className="text-blue-600">{courseProgress}%</span>
                                      </div>
                                      <Progress 
                                        value={courseProgress} 
                                        className="w-full h-2 bg-gray-100"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-2 ml-6">
                                    <Button 
                                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                      onClick={() => navigate(`/learn/${enrollment.courses?.id}`)}
                                    >
                                      <Play className="w-4 h-4 mr-2" />
                                      Continue Learning
                                    </Button>
                                    
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

export default StudentCourses;
