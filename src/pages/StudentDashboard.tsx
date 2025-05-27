
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Users } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import UserEventRegistrations from "@/components/events/UserEventRegistrations";

const StudentDashboard = () => {
  const [fullName, setFullName] = useState<string | null>(null);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch enrolled courses
  const { data: enrolledCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (
            title,
            description,
            image_url,
            duration
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent activity (study materials)
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_study_progress')
        .select(`
          *,
          study_materials (
            title,
            description,
            material_type
          ),
          courses (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  if (profileLoading || coursesLoading || activityLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StudentSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {fullName || 'Student'}!
          </h1>

          {/* Dashboard Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Number of courses you're currently enrolled in</CardDescription>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {enrolledCourses?.length || 0} Courses
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Since</CardTitle>
                <CardDescription>Your account creation date</CardDescription>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {profile?.created_at ? format(new Date(profile.created_at), 'MMM dd, yyyy') : 'N/A'}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Last Activity</CardTitle>
                <CardDescription>Date of your last study session</CardDescription>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">
                {recentActivity && recentActivity.length > 0 ? format(new Date(recentActivity[0].created_at), 'MMM dd, yyyy') : 'No Activity'}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Enrolled Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-4">My Courses</h2>
              {enrolledCourses && enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardHeader>
                        <CardTitle>{enrollment.courses?.title}</CardTitle>
                        <CardDescription>{enrollment.courses?.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Clock size={16} />
                          {enrollment.courses?.duration}
                        </div>
                        <Badge variant="secondary">
                          {enrollment.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Enrolled Courses</h3>
                    <p className="text-gray-500">Explore our courses and start learning today!</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Progress Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Progress Overview</h2>
              {enrolledCourses && enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment) => (
                    <Card key={enrollment.id}>
                      <CardHeader>
                        <CardTitle>{enrollment.courses?.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2">
                          <div className="text-sm font-medium">
                            {enrollment.progress}% Completed
                          </div>
                          <Progress value={enrollment.progress} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Progress Available</h3>
                    <p className="text-gray-500">Enroll in courses to track your learning progress.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activity and Event Registrations */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardHeader>
                        <CardTitle>{activity.study_materials?.title}</CardTitle>
                        <CardDescription>
                          {activity.study_materials?.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <FileText size={16} />
                          {activity.study_materials?.material_type} from {activity.courses?.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          Completed on {format(new Date(activity.completed_at || activity.created_at), 'MMM dd, yyyy')}
                        </div>
                        <Badge variant="secondary">
                          Completed
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Activity</h3>
                    <p className="text-gray-500">Start learning to see your recent activity here.</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <UserEventRegistrations />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
