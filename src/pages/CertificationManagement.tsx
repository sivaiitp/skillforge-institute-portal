
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Award, Search, Check, X } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdminSidebar from '@/components/AdminSidebar';

const CertificationManagement = () => {
  const { userRole } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [verificationNumber, setVerificationNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCertificates();
      fetchStudents();
      fetchCourses();
    }
  }, [userRole]);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (title, certification),
        profiles (full_name, email)
      `)
      .order('issued_date', { ascending: false });
    
    if (error) {
      toast.error('Error fetching certificates');
      return;
    }
    setCertificates(data || []);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'student')
      .order('full_name');
    
    if (error) {
      toast.error('Error fetching students');
      return;
    }
    setStudents(data || []);
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, certification')
      .eq('is_active', true)
      .order('title');
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both student and course');
      return;
    }

    const certificateNumber = generateCertificateNumber();
    
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: selectedStudent,
        course_id: selectedCourse,
        certificate_number: certificateNumber,
        issued_date: new Date().toISOString(),
        is_valid: true
      });

    if (error) {
      toast.error('Error issuing certificate');
      return;
    }

    toast.success('Certificate issued successfully!');
    setSelectedStudent('');
    setSelectedCourse('');
    fetchCertificates();
  };

  const handleVerifyCertificate = async (e) => {
    e.preventDefault();
    
    if (!verificationNumber) {
      toast.error('Please enter a certificate number');
      return;
    }

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (title, certification),
        profiles (full_name, email)
      `)
      .eq('certificate_number', verificationNumber)
      .single();

    if (error || !data) {
      setVerificationResult({ valid: false, message: 'Certificate not found' });
      return;
    }

    setVerificationResult({
      valid: data.is_valid,
      data: data,
      message: data.is_valid ? 'Certificate is valid' : 'Certificate has been revoked'
    });
  };

  const toggleCertificateValidity = async (certificateId, currentStatus) => {
    const { error } = await supabase
      .from('certificates')
      .update({ is_valid: !currentStatus })
      .eq('id', certificateId);

    if (error) {
      toast.error('Error updating certificate status');
      return;
    }

    toast.success(`Certificate ${!currentStatus ? 'validated' : 'revoked'} successfully!`);
    fetchCertificates();
    setVerificationResult(null);
  };

  if (userRole !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <AdminSidebar />
      
      <div className="ml-64 pt-20">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Certification Management</h1>
              <p className="text-gray-600">Issue and validate certificates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Issue Certificate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Issue Certificate
                  </CardTitle>
                  <CardDescription>
                    Issue a new certificate to a student
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleIssueCertificate} className="space-y-4">
                    <div>
                      <Label htmlFor="student">Student</Label>
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.full_name} ({student.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                        <SelectTrigger>
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

                    <Button type="submit" className="w-full">
                      Issue Certificate
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Verify Certificate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Verify Certificate
                  </CardTitle>
                  <CardDescription>
                    Verify the authenticity of a certificate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVerifyCertificate} className="space-y-4">
                    <div>
                      <Label htmlFor="verificationNumber">Certificate Number</Label>
                      <Input
                        id="verificationNumber"
                        value={verificationNumber}
                        onChange={(e) => setVerificationNumber(e.target.value)}
                        placeholder="Enter certificate number"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Verify Certificate
                    </Button>
                  </form>

                  {verificationResult && (
                    <div className={`mt-4 p-4 rounded-lg ${verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {verificationResult.valid ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-medium ${verificationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                          {verificationResult.message}
                        </span>
                      </div>
                      
                      {verificationResult.data && (
                        <div className="text-sm space-y-1">
                          <p><strong>Student:</strong> {verificationResult.data.profiles?.full_name}</p>
                          <p><strong>Course:</strong> {verificationResult.data.courses?.title}</p>
                          <p><strong>Issued:</strong> {new Date(verificationResult.data.issued_date).toLocaleDateString()}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => toggleCertificateValidity(verificationResult.data.id, verificationResult.data.is_valid)}
                          >
                            {verificationResult.data.is_valid ? 'Revoke' : 'Validate'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Certificates List */}
            <Card>
              <CardHeader>
                <CardTitle>All Certificates ({certificates.length})</CardTitle>
                <CardDescription>
                  List of all issued certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate Number</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono text-sm">
                          {cert.certificate_number}
                        </TableCell>
                        <TableCell>{cert.profiles?.full_name}</TableCell>
                        <TableCell>{cert.courses?.title}</TableCell>
                        <TableCell>
                          {new Date(cert.issued_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={cert.is_valid ? 'default' : 'destructive'}>
                            {cert.is_valid ? 'Valid' : 'Revoked'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCertificateValidity(cert.id, cert.is_valid)}
                          >
                            {cert.is_valid ? 'Revoke' : 'Validate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CertificationManagement;
