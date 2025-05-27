
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
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
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

      // Check for certificates for this student using type assertion
      const { data: certificates, error: certError } = await (supabase as any)
        .from('certificates')
        .select('course_id')
        .eq('user_id', studentId)
        .eq('is_valid', true);

      if (certError) {
        console.error('Error fetching certificates:', certError);
      }

      const certificatedCourseIds = new Set(certificates?.map((cert: any) => cert.course_id) || []);

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
    if (!searchName.trim()) {
      toast.error('Please enter a student name to search');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSelectedStudent(null);
    setEnrolledCourses([]);
    console.log('Searching for student:', searchName);
    
    try {
      const searchTerm = searchName.trim().toLowerCase();
      
      // Search for students by name or email with the new RLS policies
      const { data: students, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'student')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

      console.log('Search results:', { students, error, searchTerm });

      if (error) {
        console.error('Error searching students:', error);
        toast.error('Error searching for students');
        return;
      }

      if (!students || students.length === 0) {
        toast.error(`No students found matching "${searchName.trim()}"`);
        return;
      }

      const formattedStudents: Student[] = students.map(student => ({
        id: student.id,
        full_name: student.full_name || student.email || 'Unknown',
        email: student.email || ''
      }));

      setSearchResults(formattedStudents);
      toast.success(`Found ${formattedStudents.length} student(s) matching "${searchName.trim()}"`);
      
    } catch (error) {
      console.error('Error in search:', error);
      toast.error('Error searching for students');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = async (student: Student) => {
    console.log('Selecting student:', student);
    setSelectedStudent(student);
    setSearchResults([]); // Clear search results after selection
    await fetchStudentEnrollments(student.id);
    toast.success(`Selected student: ${student.full_name}`);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchName('');
    setSearchResults([]);
    setEnrolledCourses([]);
  };

  return {
    searchName,
    setSearchName,
    searchResults,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent,
  };
};
