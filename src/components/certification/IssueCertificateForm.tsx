
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Award, Search, User, BookOpen, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  enrollment_date: string;
  has_certificate: boolean;
}

interface IssueCertificateFormProps {
  students: Student[];
  courses: Course[];
  onCertificateIssued: () => void;
}

const IssueCertificateForm = ({ students, courses, onCertificateIssued }: IssueCertificateFormProps) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const fetchStudentEnrollments = async (studentId: string) => {
    if (!studentId) {
      setEnrolledCourses([]);
      return;
    }

    setLoadingEnrollments(true);
    try {
      // Get enrollments with course details and check for existing certificates
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          enrollment_date,
          courses:course_id (
            id,
            title
          )
        `)
        .eq('user_id', studentId)
        .eq('status', 'active');

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        toast.error('Error fetching student enrollments');
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        setEnrolledCourses([]);
        return;
      }

      // Get existing certificates for this student
      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('course_id')
        .eq('user_id', studentId)
        .eq('is_valid', true);

      if (certError) {
        console.error('Error fetching certificates:', certError);
      }

      const certificatedCourseIds = new Set(certificates?.map(cert => cert.course_id) || []);

      // Format enrolled courses with certificate status
      const formattedCourses: EnrolledCourse[] = enrollments
        .filter(enrollment => enrollment.courses)
        .map(enrollment => ({
          id: enrollment.courses.id,
          title: enrollment.courses.title,
          enrollment_date: enrollment.enrollment_date,
          has_certificate: certificatedCourseIds.has(enrollment.course_id)
        }));

      setEnrolledCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      toast.error('Error fetching student enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleSearchStudent = async () => {
    if (!searchEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSearching(true);
    try {
      const { data: student, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('email', searchEmail.trim())
        .eq('role', 'student')
        .single();

      if (error || !student) {
        toast.error('Student not found with this email address');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      setSelectedStudent(student);
      await fetchStudentEnrollments(student.id);
      toast.success(`Found student: ${student.full_name}`);
    } catch (error) {
      console.error('Error searching student:', error);
      toast.error('Error searching for student');
      setSelectedStudent(null);
      setEnrolledCourses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchEmail('');
    setSelectedCourse('');
    setEnrolledCourses([]);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both student and course');
      return;
    }

    // Check if certificate already exists
    const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);
    if (selectedCourseData?.has_certificate) {
      toast.error('Student already has a certificate for this course');
      return;
    }

    setIsLoading(true);
    const certificateNumber = generateCertificateNumber();
    
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: selectedStudent.id,
        course_id: selectedCourse,
        certificate_number: certificateNumber,
        certificate_id: certificateNumber,
        issued_date: new Date().toISOString(),
        is_valid: true
      });

    if (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
      setIsLoading(false);
      return;
    }

    toast.success(`Certificate issued successfully! Number: ${certificateNumber}`);
    handleClearStudent();
    setIsLoading(false);
    onCertificateIssued();
  };

  const availableCourses = enrolledCourses.filter(course => !course.has_certificate);

  return (
    <form onSubmit={handleIssueCertificate} className="space-y-6">
      {/* Student Search Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Search Student by Email
        </Label>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter student email address..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchStudent();
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={handleSearchStudent}
            disabled={isSearching || !searchEmail.trim()}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Selected Student Display */}
        {selectedStudent && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedStudent.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearStudent}
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Course Selection - Only show if student is selected */}
      {selectedStudent && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Select Enrolled Course (No Certificate Yet)
          </Label>
          
          {loadingEnrollments ? (
            <div className="flex items-center justify-center h-11 border border-gray-200 rounded-md bg-gray-50">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading enrollments...</span>
            </div>
          ) : availableCourses.length === 0 ? (
            <div className="flex items-center gap-2 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span className="text-sm text-amber-700">
                {enrolledCourses.length === 0 
                  ? "This student is not enrolled in any courses" 
                  : "This student already has certificates for all enrolled courses"
                }
              </span>
            </div>
          ) : (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Choose a course to certify" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{course.title}</span>
                        <p className="text-xs text-gray-500">
                          Enrolled: {new Date(course.enrollment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading || !selectedStudent || !selectedCourse || availableCourses.length === 0}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Issuing Certificate...
          </>
        ) : (
          <>
            <Award className="w-5 h-5 mr-2" />
            Issue Certificate
          </>
        )}
      </Button>
    </form>
  );
};

export default IssueCertificateForm;
