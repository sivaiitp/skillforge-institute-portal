import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1">
        <SidebarProvider>
          <div className="min-h-full flex w-full">
            <StudentSidebar />
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">My Courses</h1>
              </header>
              
              <div className="flex-1 p-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                  <p className="text-gray-600">Track your learning progress and access course materials</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading your courses...</p>
                  </div>
                ) : enrollments.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                      <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                      <Button onClick={() => navigate('/courses')}>
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={enrollment.courses?.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                            alt={enrollment.courses?.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge 
                              variant={enrollment.status === 'active' ? 'default' : 'secondary'}
                            >
                              {enrollment.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="text-lg">{enrollment.courses?.title}</CardTitle>
                          <CardDescription>{enrollment.courses?.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {enrollment.courses?.duration}
                            </div>
                            <Badge variant="outline">{enrollment.courses?.level}</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{enrollment.progress || 0}%</span>
                            </div>
                            <Progress value={enrollment.progress || 0} className="w-full" />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              onClick={() => navigate(`/courses/${enrollment.courses?.id}`)}
                            >
                              Continue Learning
                            </Button>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentCourses;
