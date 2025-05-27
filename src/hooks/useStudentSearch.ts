
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
      // First check if there are any profiles at all
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*');

      console.log('Total profiles in database:', allProfiles?.length || 0, allProfiles);

      if (allError) {
        console.error('Error fetching all profiles:', allError);
      }

      // Search for the user with various methods
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .ilike('email', searchEmail.trim());

      console.log('Search results:', { users, error, searchEmail: searchEmail.trim() });

      if (error) {
        console.error('Error searching student:', error);
        toast.error('Error searching for student');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      if (!users || users.length === 0) {
        // If no profile found, let's check if we can create one from auth.users
        console.log('No profile found, checking if user exists in auth...');
        
        // Try to get current user info to see if we can access auth data
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('Current auth user:', currentUser);

        toast.error(`No student profile found for ${searchEmail.trim()}. The user may need to complete their profile setup or contact admin.`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      const foundUser = users[0];
      console.log('Found user:', foundUser);

      // Check if the user has a role, if not, we can't determine if they're a student
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
