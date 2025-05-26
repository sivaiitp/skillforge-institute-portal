
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Award, Check, ChevronsUpDown, User, BookOpen, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    setSelectedCourse('');
    setOpen(false);
    fetchStudentEnrollments(studentId);
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
        user_id: selectedStudent,
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
    setSelectedStudent('');
    setSelectedCourse('');
    setEnrolledCourses([]);
    setIsLoading(false);
    onCertificateIssued();
  };

  const selectedStudentData = students.find(student => student.id === selectedStudent);
  const availableCourses = enrolledCourses.filter(course => !course.has_certificate);

  return (
    <form onSubmit={handleIssueCertificate} className="space-y-6">
      {/* Student Selection */}
      <div className="space-y-2">
        <Label htmlFor="student" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Search Student by Email
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              {selectedStudentData ? (
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{selectedStudentData.full_name}</p>
                    <p className="text-sm text-gray-500 truncate">{selectedStudentData.email}</p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Search student by email...</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 z-50" style={{ width: 'var(--radix-popover-trigger-width)' }}>
            <Command>
              <CommandInput placeholder="Search student by email..." className="h-9" />
              <CommandList className="max-h-64">
                <CommandEmpty>No student found.</CommandEmpty>
                <CommandGroup>
                  {students.map((student) => (
                    <CommandItem
                      key={student.id}
                      value={student.email}
                      onSelect={() => handleStudentSelect(student.id)}
                      className="p-3"
                    >
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4",
                          selectedStudent === student.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{student.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">{student.email}</p>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Course Selection - Only show if student is selected */}
      {selectedStudent && (
        <div className="space-y-2">
          <Label htmlFor="course" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Select Enrolled Course (No Certificate Yet)
          </Label>
          
          {loadingEnrollments ? (
            <div className="flex items-center justify-center h-11 border border-gray-200 rounded-md">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading enrollments...</span>
            </div>
          ) : availableCourses.length === 0 ? (
            <div className="flex items-center gap-2 p-3 border border-amber-200 bg-amber-50 rounded-md">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700">
                {enrolledCourses.length === 0 
                  ? "Student is not enrolled in any courses" 
                  : "Student already has certificates for all enrolled courses"
                }
              </span>
            </div>
          ) : (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Choose a course to certify" />
              </SelectTrigger>
              <SelectContent className="z-50">
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
