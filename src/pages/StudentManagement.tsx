
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Student Management</h1>
                <p className="text-gray-300">Monitor and manage student accounts and progress</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-white">{students.length}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Active Enrollments</p>
                    <p className="text-2xl font-bold text-white">{enrollments.filter(e => e.status === 'active').length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm">Total Enrollments</p>
                    <p className="text-2xl font-bold text-white">{enrollments.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="w-5 h-5 text-blue-400" />
              Search Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-blue-400/50"
            />
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">All Students ({filteredStudents.length})</CardTitle>
            <CardDescription className="text-gray-300">
              Manage student accounts and view their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading students...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-gray-200">Name</TableHead>
                      <TableHead className="text-gray-200">Email</TableHead>
                      <TableHead className="text-gray-200">Phone</TableHead>
                      <TableHead className="text-gray-200">Joined</TableHead>
                      <TableHead className="text-gray-200">Enrollments</TableHead>
                      <TableHead className="text-gray-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const studentEnrollments = getStudentEnrollments(student.id);
                      return (
                        <TableRow key={student.id} className="border-white/20 hover:bg-white/5 transition-colors">
                          <TableCell className="font-medium text-white">
                            {student.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Mail className="w-4 h-4 text-blue-400" />
                              {student.email || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Phone className="w-4 h-4 text-green-400" />
                              {student.phone || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              {new Date(student.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-400/50 text-blue-400 bg-blue-500/10">
                              {studentEnrollments.length} courses
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-colors"
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
                <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
                <p className="text-gray-400">
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
