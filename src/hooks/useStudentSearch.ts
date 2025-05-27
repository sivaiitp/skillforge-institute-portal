
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
    console.log('Searching for student with email:', searchEmail.trim());
    
    try {
      // Search for student directly in profiles table
      const { data: student, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('email', searchEmail.trim().toLowerCase())
        .maybeSingle();

      console.log('Direct student search result:', { student, error });

      if (error) {
        console.error('Error searching student:', error);
        toast.error('Error searching for student');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      if (!student) {
        // Let's also try a case-insensitive search with ilike
        const { data: studentIlike, error: errorIlike } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .ilike('email', searchEmail.trim())
          .maybeSingle();

        console.log('Case-insensitive search result:', { studentIlike, errorIlike });

        if (!studentIlike) {
          toast.error('No user found with this email address');
          setSelectedStudent(null);
          setEnrolledCourses([]);
          return;
        }

        // Use the result from ilike search
        if (studentIlike.role !== 'student') {
          toast.error(`User found but they are registered as ${studentIlike.role}, not a student`);
          setSelectedStudent(null);
          setEnrolledCourses([]);
          return;
        }

        setSelectedStudent({
          id: studentIlike.id,
          full_name: studentIlike.full_name || 'Unknown',
          email: studentIlike.email || ''
        });
        await fetchStudentEnrollments(studentIlike.id);
        toast.success(`Found student: ${studentIlike.full_name || studentIlike.email}`);
        return;
      }

      // Check if the user is a student
      if (student.role !== 'student') {
        toast.error(`User found but they are registered as ${student.role}, not a student`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      setSelectedStudent({
        id: student.id,
        full_name: student.full_name || 'Unknown',
        email: student.email || ''
      });
      await fetchStudentEnrollments(student.id);
      toast.success(`Found student: ${student.full_name || student.email}`);
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
    setEnrolledCourses([]);
  };

  return {
    searchEmail,
    setSearchEmail,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleClearStudent,
  };
};
