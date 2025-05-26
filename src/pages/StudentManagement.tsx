
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Search, Mail, Phone, Calendar, Users, GraduationCap, BookOpen } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

const StudentManagement = () => {
  const { userRole } = useAuth();
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchStudents();
      fetchEnrollments();
    }
  }, [userRole]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Error fetching students');
        return;
      }
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (title)
        `);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        return;
      }
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudentEnrollments = (studentId) => {
    return enrollments.filter(enrollment => enrollment.user_id === studentId);
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Student Management</h1>
                <p className="text-gray-600">Monitor and manage student accounts and progress</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Active Enrollments</p>
                    <p className="text-2xl font-bold text-gray-800">{enrollments.filter(e => e.status === 'active').length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Total Enrollments</p>
                    <p className="text-2xl font-bold text-gray-800">{enrollments.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <Card className="mb-6 bg-white shadow-sm border hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Search className="w-5 h-5 text-blue-500" />
              Search Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-gray-800">All Students ({filteredStudents.length})</CardTitle>
            <CardDescription className="text-gray-600">
              Manage student accounts and view their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading students...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Phone</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Joined</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Enrollments</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const studentEnrollments = getStudentEnrollments(student.id);
                      return (
                        <TableRow key={student.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-gray-800">
                            {student.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4 text-blue-500" />
                              {student.email || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4 text-green-500" />
                              {student.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              {new Date(student.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50">
                              {studentEnrollments.length} courses
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Students Found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'No students have registered yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentManagement;
