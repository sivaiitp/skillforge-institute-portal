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

const StudentCourses = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
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
      setEnrollments(data || []);
    } catch (error) {
      toast.error('Error fetching courses');
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={enrollment.courses?.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                            alt={enrollment.courses?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <Badge 
                              variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                              className={enrollment.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}
                            >
                              {enrollment.status}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white font-bold text-lg mb-2">{enrollment.courses?.title}</h3>
                          </div>
                        </div>
                        
                        <CardContent className="p-6 space-y-4">
                          <CardDescription className="text-gray-600 line-clamp-2">
                            {enrollment.courses?.description}
                          </CardDescription>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{enrollment.courses?.duration}</span>
                            </div>
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              {enrollment.courses?.level}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-gray-700">Progress</span>
                              <span className="text-blue-600">{enrollment.progress || 0}%</span>
                            </div>
                            <Progress 
                              value={enrollment.progress || 0} 
                              className="w-full h-2 bg-gray-100"
                            />
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              onClick={() => navigate(`/courses/${enrollment.courses?.id}`)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          </div>
                          
                          <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t">
                            <Calendar className="h-3 w-3" />
                            Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
