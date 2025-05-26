
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Users, BookOpen, BarChart3, CreditCard, Target, Award } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface CourseEnrollmentData {
  course: {
    title: string;
    price: number;
  } | null;
  count: number;
  revenue: number;
}

const PaymentReports = () => {
  const { userRole } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAllData();
    }
  }, [userRole]);

  const fetchAllData = async () => {
    try {
      // Fetch enrollments without joining profiles (since foreign key doesn't exist)
      const [enrollmentsRes, coursesRes, studentsRes, certificatesRes] = await Promise.all([
        supabase.from('enrollments').select(`
          *,
          courses (title, price)
        `),
        supabase.from('courses').select('*'),
        supabase.from('profiles').select('*').eq('role', 'student'),
        supabase.from('certificates').select('*')
      ]);

      if (enrollmentsRes.error) throw enrollmentsRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (studentsRes.error) throw studentsRes.error;
      if (certificatesRes.error) throw certificatesRes.error;

      setEnrollments(enrollmentsRes.data || []);
      setCourses(coursesRes.data || []);
      setStudents(studentsRes.data || []);
      setCertificates(certificatesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.courses?.price || 0);
    }, 0);

    const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
    const activeCourses = courses.filter(c => c.is_active).length;

    return {
      totalRevenue,
      totalEnrollments: enrollments.length,
      activeEnrollments,
      completedEnrollments,
      totalStudents: students.length,
      totalCourses: courses.length,
      activeCourses,
      totalCertificates: certificates.length
    };
  };

  const getTopCourses = (): CourseEnrollmentData[] => {
    const courseEnrollments: Record<string, CourseEnrollmentData> = {};
    
    enrollments.forEach(enrollment => {
      const courseId = enrollment.course_id;
      if (!courseEnrollments[courseId]) {
        courseEnrollments[courseId] = {
          course: enrollment.courses,
          count: 0,
          revenue: 0
        };
      }
      courseEnrollments[courseId].count++;
      courseEnrollments[courseId].revenue += enrollment.courses?.price || 0;
    });

    return Object.values(courseEnrollments)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment reports...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const topCourses = getTopCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Payment & Reports</h1>
                <p className="text-gray-600">Financial reports and business analytics</p>
              </div>
            </div>
            
            {/* Quick Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Monthly Revenue (Estimated)</p>
                  <p className="text-2xl font-bold text-gray-800">₹{(stats.totalRevenue * 0.15).toLocaleString('en-IN')}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-green-600 mt-1">
                From {stats.totalEnrollments} enrollments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
              <p className="text-xs text-blue-600 mt-1">
                {stats.activeEnrollments} active enrollments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.activeCourses}</div>
              <p className="text-xs text-purple-600 mt-1">
                Out of {stats.totalCourses} total courses
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Certificates Issued</CardTitle>
              <Award className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{stats.totalCertificates}</div>
              <p className="text-xs text-orange-600 mt-1">
                {stats.completedEnrollments} completed courses
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Courses */}
          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="w-5 h-5 text-yellow-500" />
                Top Performing Courses
              </CardTitle>
              <CardDescription className="text-gray-600">
                Courses with highest enrollment and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.length > 0 ? (
                  topCourses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.course?.title || 'Unknown Course'}</h4>
                        <p className="text-sm text-gray-600">{item.count} enrollments</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">₹{item.revenue.toLocaleString('en-IN')}</div>
                        <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                          ₹{(item.course?.price || 0).toLocaleString('en-IN')} each
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No course data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Enrollments</CardTitle>
              <CardDescription className="text-gray-600">
                Latest course enrollments and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200 hover:bg-gray-50">
                        <TableHead className="text-gray-700">Course</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.slice(0, 10).map((enrollment) => (
                        <TableRow key={enrollment.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                          <TableCell className="text-gray-800">
                            {enrollment.courses?.title || 'N/A'}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            ₹{(enrollment.courses?.price || 0).toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No enrollment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentReports;
