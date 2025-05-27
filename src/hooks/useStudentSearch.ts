
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
      toast.error('Please enter a student name');
      return;
    }

    setIsSearching(true);
    const searchTerm = searchName.trim().toLowerCase();
    console.log('Searching for students with name (case-insensitive partial match):', searchTerm);
    
    try {
      // First, let's see ALL profiles to understand what data we have
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      console.log('ALL PROFILES IN DATABASE:', { allProfiles, allError });

      // Search for students with more flexible matching
      const { data: students, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'student');

      console.log('STUDENTS ONLY:', { students, error });

      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Error searching for students');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // If no students with role 'student', let's try without role filter
      if (!students || students.length === 0) {
        console.log('No students with role=student found. Trying all profiles...');
        
        const { data: allUsers, error: allUsersError } = await supabase
          .from('profiles')
          .select('id, full_name, email, role');

        console.log('ALL USERS FOR SEARCH:', { allUsers, allUsersError });

        if (allUsersError) {
          console.error('Error fetching all users:', allUsersError);
          toast.error('Error searching for users');
          setSelectedStudent(null);
          setEnrolledCourses([]);
          return;
        }

        if (!allUsers || allUsers.length === 0) {
          console.log('No users found in database at all');
          toast.error('No users found in database');
          setSelectedStudent(null);
          setEnrolledCourses([]);
          return;
        }

        // Filter all users client-side for matching
        const matchingUsers = allUsers.filter(user => {
          const fullName = (user.full_name || '').toLowerCase();
          const email = (user.email || '').toLowerCase();
          return fullName.includes(searchTerm) || email.includes(searchTerm);
        });

        console.log('Matching users found (any role):', { matchingUsers, searchTerm });

        if (matchingUsers.length === 0) {
          console.log('No user found matching search term:', searchTerm);
          toast.error(`No user found with name or email containing "${searchName.trim()}"`);
          setSelectedStudent(null);
          setEnrolledCourses([]);
          return;
        }

        // Use the first matching user
        const foundUser = matchingUsers[0];
        console.log('Selected user (any role):', foundUser);

        if (matchingUsers.length > 1) {
          console.log(`Found ${matchingUsers.length} users matching "${searchTerm}", selecting first one:`, foundUser);
          toast.info(`Found ${matchingUsers.length} matches, selected: ${foundUser.full_name || foundUser.email}`);
        }

        // Set as selected student even if not explicitly role 'student'
        setSelectedStudent({
          id: foundUser.id,
          full_name: foundUser.full_name || foundUser.email || 'Unknown',
          email: foundUser.email || ''
        });
        
        await fetchStudentEnrollments(foundUser.id);
        toast.success(`Found user: ${foundUser.full_name || foundUser.email} (Role: ${foundUser.role || 'unknown'})`);
        
        return;
      }

      // Filter students client-side for more flexible matching
      const matchingStudents = students.filter(student => {
        const fullName = (student.full_name || '').toLowerCase();
        const email = (student.email || '').toLowerCase();
        return fullName.includes(searchTerm) || email.includes(searchTerm);
      });

      console.log('Matching students found:', { matchingStudents, searchTerm });

      if (matchingStudents.length === 0) {
        console.log('No student found matching search term:', searchTerm);
        toast.error(`No student found with name or email containing "${searchName.trim()}"`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // If multiple results, take the first one
      const foundStudent = matchingStudents[0];
      console.log('Selected student:', foundStudent);

      if (matchingStudents.length > 1) {
        console.log(`Found ${matchingStudents.length} students matching "${searchTerm}", selecting first one:`, foundStudent);
        toast.info(`Found ${matchingStudents.length} matches, selected: ${foundStudent.full_name || foundStudent.email}`);
      }

      // Student found - set as selected student
      setSelectedStudent({
        id: foundStudent.id,
        full_name: foundStudent.full_name || foundStudent.email || 'Unknown',
        email: foundStudent.email || ''
      });
      
      await fetchStudentEnrollments(foundStudent.id);
      toast.success(`Found student: ${foundStudent.full_name || foundStudent.email}`);
      
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
    setSearchName('');
    setEnrolledCourses([]);
  };

  return {
    searchName,
    setSearchName,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleClearStudent,
  };
};
