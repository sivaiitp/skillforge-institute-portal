
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, FileText, Award, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalCertificates: 0,
    totalEnrollments: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchDashboardStats();
    fetchRecentActivities();
  }, [userRole, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const [studentsRes, coursesRes, certificatesRes, enrollmentsRes] = await Promise.all([
        supabase.from('profiles').select('id').eq('role', 'student'),
        supabase.from('courses').select('id'),
        supabase.from('certificates').select('id'),
        supabase.from('enrollments').select('id')
      ]);

      setStats({
        totalStudents: studentsRes.data?.length || 0,
        totalCourses: coursesRes.data?.length || 0,
        totalCertificates: certificatesRes.data?.length || 0,
        totalEnrollments: enrollmentsRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (title),
        profiles (full_name)
      `)
      .order('issued_date', { ascending: false })
      .limit(5);
    
    if (!error) {
      setRecentActivities(data || []);
    }
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.user_metadata?.first_name || 'Admin'}</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/students')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/courses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Available courses
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/certificates')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCertificates}</div>
              <p className="text-xs text-muted-foreground">
                Certificates awarded
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/reports')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">
                Course enrollments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin/courses')} 
                className="w-full justify-start"
                variant="outline"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Add New Course
              </Button>
              <Button 
                onClick={() => navigate('/admin/certificates')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Award className="w-4 h-4 mr-2" />
                Issue Certificate
              </Button>
              <Button 
                onClick={() => navigate('/admin/assessments')} 
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
              <Button 
                onClick={() => navigate('/admin/students')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Students
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest certificates issued
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.profiles?.full_name}</h4>
                      <p className="text-sm text-gray-600">{activity.courses?.title}</p>
                      <p className="text-xs text-gray-500 font-mono">{activity.certificate_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        Certified
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No recent activities</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
