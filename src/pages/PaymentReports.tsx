
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Users, BookOpen, BarChart3 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
      const [enrollmentsRes, coursesRes, studentsRes, certificatesRes] = await Promise.all([
        supabase.from('enrollments').select(`
          *,
          courses (title, price),
          profiles (full_name, email)
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
    return <div>Access denied</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const stats = calculateStats();
  const topCourses = getTopCourses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <AdminSidebar />
      
      <div className="ml-64 pt-20">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Payment & Reports</h1>
              <p className="text-gray-600">Financial reports and analytics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From {stats.totalEnrollments} enrollments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeEnrollments} active enrollments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    Out of {stats.totalCourses} total courses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCertificates}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedEnrollments} completed courses
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Top Performing Courses
                  </CardTitle>
                  <CardDescription>
                    Courses with highest enrollment and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCourses.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.course?.title || 'Unknown Course'}</h4>
                          <p className="text-sm text-gray-600">{item.count} enrollments</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${item.revenue.toFixed(2)}</div>
                          <Badge variant="outline">${(item.course?.price || 0).toFixed(2)} each</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Enrollments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Enrollments</CardTitle>
                  <CardDescription>
                    Latest course enrollments and payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.slice(0, 10).map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            {enrollment.profiles?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {enrollment.courses?.title || 'N/A'}
                          </TableCell>
                          <TableCell>
                            ${(enrollment.courses?.price || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {new Date(enrollment.enrollment_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentReports;
