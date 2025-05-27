
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Plus, Users, Search, Download, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { useStudentSearch } from '@/hooks/useStudentSearch';

interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  is_valid: boolean;
  user_id: string;
  course_id: string;
  courses: {
    title: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Course {
  id: string;
  title: string;
}

const CertificateManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const {
    searchName,
    setSearchName,
    selectedStudent,
    isSearching,
    handleSearchStudent,
    handleClearStudent
  } = useStudentSearch();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchCertificates();
    fetchCourses();
  }, [user, userRole, navigate]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (title),
          profiles (full_name, email)
        `)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      toast.error('Error fetching certificates');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both a student and a course');
      return;
    }

    try {
      setLoading(true);

      // Check if certificate already exists
      const { data: existingCert } = await (supabase as any)
        .from('certificates')
        .select('id')
        .eq('user_id', selectedStudent.id)
        .eq('course_id', selectedCourse)
        .single();

      if (existingCert) {
        toast.error('Certificate already exists for this student and course');
        return;
      }

      const { data, error } = await (supabase as any)
        .from('certificates')
        .insert([
          {
            user_id: selectedStudent.id,
            course_id: selectedCourse,
            issuer_id: user.id
          }
        ])
        .select(`
          *,
          courses (title),
          profiles (full_name, email)
        `);

      if (error) throw error;

      toast.success('Certificate issued successfully!');
      setShowIssueForm(false);
      setSelectedCourse('');
      handleClearStudent();
      fetchCertificates();
    } catch (error) {
      toast.error('Error issuing certificate');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeCertificate = async (certificateId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('certificates')
        .update({ is_valid: false })
        .eq('id', certificateId);

      if (error) throw error;

      toast.success('Certificate revoked successfully');
      fetchCertificates();
    } catch (error) {
      toast.error('Error revoking certificate');
      console.error('Error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">Certificate Management</h1>
                  <p className="text-gray-600">Issue and manage course certificates</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowIssueForm(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Issue Certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Issue Certificate Form */}
        {showIssueForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Issue New Certificate</CardTitle>
              <CardDescription>Select a student and course to issue a certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Search Student</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Enter student name"
                    />
                    <Button 
                      onClick={handleSearchStudent}
                      disabled={isSearching}
                      variant="outline"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedStudent && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <p className="font-medium">{selectedStudent.full_name}</p>
                      <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleIssueCertificate}
                  disabled={loading || !selectedStudent || !selectedCourse}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Issue Certificate
                </Button>
                <Button 
                  onClick={() => {
                    setShowIssueForm(false);
                    handleClearStudent();
                    setSelectedCourse('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Issued Certificates ({certificates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                <p className="text-lg text-gray-600">Loading certificates...</p>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-16">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Certificates Issued</h3>
                <p className="text-gray-600 mb-6">Start by issuing your first certificate to a student.</p>
                <Button 
                  onClick={() => setShowIssueForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Issue First Certificate
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Certificate Number</th>
                      <th className="text-left p-4">Student</th>
                      <th className="text-left p-4">Course</th>
                      <th className="text-left p-4">Issued Date</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((certificate) => (
                      <tr key={certificate.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-mono text-sm">{certificate.certificate_number}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{certificate.profiles?.full_name}</p>
                            <p className="text-sm text-gray-600">{certificate.profiles?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">{certificate.courses?.title}</td>
                        <td className="p-4">{new Date(certificate.issued_date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            certificate.is_valid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {certificate.is_valid ? 'Valid' : 'Revoked'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            {certificate.is_valid && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRevokeCertificate(certificate.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateManagement;
