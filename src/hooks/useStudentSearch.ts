
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
      // First, let's check all profiles to see what exists
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      console.log('All profiles in database:', allProfiles);

      // Search with multiple methods to find the user
      const searchMethods = [
        // Exact match
        () => supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('email', searchEmail.trim()),
        
        // Case insensitive match
        () => supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .ilike('email', searchEmail.trim()),
        
        // Lowercase exact match
        () => supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('email', searchEmail.trim().toLowerCase()),
          
        // Contains match
        () => supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .ilike('email', `%${searchEmail.trim()}%`)
      ];

      let foundUser = null;
      
      for (let i = 0; i < searchMethods.length; i++) {
        const { data: users, error } = await searchMethods[i]();
        console.log(`Search method ${i + 1} result:`, { users, error });
        
        if (error) {
          console.error(`Error in search method ${i + 1}:`, error);
          continue;
        }
        
        if (users && users.length > 0) {
          foundUser = users[0];
          console.log(`Found user with method ${i + 1}:`, foundUser);
          break;
        }
      }

      if (!foundUser) {
        // Let's also check auth.users to see if user exists there but not in profiles
        console.log('No user found in profiles, this might indicate the user exists in auth but not in profiles table');
        toast.error('No user found with this email address. The user might need to complete their profile setup.');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // Check if the user has a role, if not, assume they need to be set as student
      if (!foundUser.role) {
        console.log('User found but has no role assigned');
        toast.error('User found but has no role assigned. Please contact admin to set up the user role.');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // Check if the user is a student
      if (foundUser.role !== 'student') {
        toast.error(`User found but they are registered as ${foundUser.role}, not a student`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      setSelectedStudent({
        id: foundUser.id,
        full_name: foundUser.full_name || 'Unknown',
        email: foundUser.email || ''
      });
      await fetchStudentEnrollments(foundUser.id);
      toast.success(`Found student: ${foundUser.full_name || foundUser.email}`);
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
