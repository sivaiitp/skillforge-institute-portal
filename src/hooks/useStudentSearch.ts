
import { useState, useEffect, useCallback } from 'react';
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
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!searchName.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // Only start searching if user has typed at least 2 characters
    if (searchName.trim().length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchName]);

  const fetchStudentEnrollments = async (studentId: string) => {
    if (!studentId) {
      setEnrolledCourses([]);
      return;
    }

    setLoadingEnrollments(true);
    console.log('Fetching enrollments for student:', studentId);
    
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

      console.log('Raw enrollments data:', enrollments);

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        toast.error('Error fetching student enrollments');
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('No enrollments found for student');
        setEnrolledCourses([]);
        return;
      }

      // Check for certificates for this student
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

      console.log('Formatted enrolled courses:', formattedCourses);
      setEnrolledCourses(formattedCourses);
      
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      toast.error('Error fetching student enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const performSearch = async () => {
    if (!searchName.trim() || searchName.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setHasSearched(true);
    console.log('Searching for student:', searchName);
    
    try {
      const searchTerm = searchName.trim().toLowerCase();
      
      // Search for students by name or email
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
        console.log(`No students found matching "${searchName.trim()}"`);
        setSearchResults([]);
        return;
      }

      const formattedStudents: Student[] = students.map(student => ({
        id: student.id,
        full_name: student.full_name || student.email || 'Unknown',
        email: student.email || ''
      }));

      setSearchResults(formattedStudents);
      
    } catch (error) {
      console.error('Error in search:', error);
      toast.error('Error searching for students');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchStudent = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a student name to search');
      return;
    }
    await performSearch();
  };

  const handleSelectStudent = async (student: Student) => {
    console.log('Selecting student:', student);
    setSelectedStudent(student);
    setSearchResults([]); // Clear search results after selection
    setHasSearched(false);
    await fetchStudentEnrollments(student.id);
    toast.success(`Selected student: ${student.full_name}`);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchName('');
    setSearchResults([]);
    setEnrolledCourses([]);
    setHasSearched(false);
  };

  return {
    searchName,
    setSearchName,
    searchResults,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    hasSearched,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent,
  };
};
