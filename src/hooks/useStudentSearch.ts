
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  enrollment_date: string;
  has_certificate: boolean;
}

export const useStudentSearch = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const fetchStudentEnrollments = async (studentId: string) => {
    if (!studentId) {
      setEnrolledCourses([]);
      return;
    }

    setLoadingEnrollments(true);
    try {
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

      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('course_id')
        .eq('user_id', studentId)
        .eq('is_valid', true);

      if (certError) {
        console.error('Error fetching certificates:', certError);
      }

      const certificatedCourseIds = new Set(certificates?.map(cert => cert.course_id) || []);

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
    const searchTerm = searchEmail.trim().toLowerCase();
    console.log('Searching for students with email containing:', searchTerm);
    
    try {
      const { data: students, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('email', `%${searchTerm}%`)
        .eq('role', 'student')
        .order('full_name');

      console.log('Student search results:', { students, error });

      if (error) {
        console.error('Error searching students:', error);
        toast.error('Error searching for students');
        setSearchResults([]);
        return;
      }

      if (!students || students.length === 0) {
        toast.error('No students found with email containing this text');
        setSearchResults([]);
        return;
      }

      setSearchResults(students);
      if (students.length === 1) {
        // Auto-select if only one result
        setSelectedStudent(students[0]);
        await fetchStudentEnrollments(students[0].id);
        toast.success(`Found student: ${students[0].full_name}`);
      } else {
        toast.success(`Found ${students.length} students`);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Error searching for students');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    await fetchStudentEnrollments(student.id);
    toast.success(`Selected student: ${student.full_name}`);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchEmail('');
    setSearchResults([]);
    setEnrolledCourses([]);
  };

  return {
    searchEmail,
    setSearchEmail,
    selectedStudent,
    searchResults,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent,
  };
};
