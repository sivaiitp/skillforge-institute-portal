
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, FileText, Award, TrendingUp, Home, Plus, Calendar } from "lucide-react";

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
        (supabase as any).from('certificates').select('id'),
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
    try {
      const { data, error } = await (supabase as any)
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
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user?.user_metadata?.first_name || 'Admin'}</p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/students')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/courses')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCourses}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/certificates')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Certificates Issued</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalCertificates}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/payments')}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalEnrollments}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Quick Actions
              </h2>
              <p className="text-gray-600 text-sm mt-1">Common administrative tasks</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/admin/courses')} 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  variant="default"
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
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activities
              </h2>
              <p className="text-gray-600 text-sm mt-1">Latest certificates issued</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{activity.profiles?.full_name}</h4>
                        <p className="text-sm text-gray-600">{activity.courses?.title}</p>
                        <p className="text-xs text-gray-500 font-mono">{activity.certificate_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Certified
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.issued_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
