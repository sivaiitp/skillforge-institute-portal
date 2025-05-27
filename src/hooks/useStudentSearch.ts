
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

      // Check for certificates for this student
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
    if (!searchName.trim()) {
      toast.error('Please enter a user name');
      return;
    }

    setIsSearching(true);
    const searchTerm = searchName.trim();
    console.log('Searching for users with name (case-insensitive partial match):', searchTerm);
    
    try {
      // Search all users, not just admins
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .ilike('full_name', `%${searchTerm}%`);

      console.log('Search results for all users:', { users, error, searchTerm, searchQuery: `%${searchTerm}%` });

      if (error) {
        console.error('Error searching user:', error);
        toast.error('Error searching for user');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      if (!users || users.length === 0) {
        console.log('No user found for name (partial match):', searchTerm);
        toast.error(`No user found with name containing "${searchTerm}"`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // If multiple results, take the first one
      const foundUser = users[0];
      console.log('Found user:', foundUser);

      if (users.length > 1) {
        console.log(`Found ${users.length} users matching "${searchTerm}", selecting first one:`, foundUser);
        toast.info(`Found ${users.length} matches, selected: ${foundUser.full_name}`);
      }

      // User found - set as selected student
      setSelectedStudent({
        id: foundUser.id,
        full_name: foundUser.full_name || foundUser.email || 'Unknown',
        email: foundUser.email || ''
      });
      
      await fetchStudentEnrollments(foundUser.id);
      toast.success(`Found user: ${foundUser.full_name || foundUser.email}`);
      
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error('Error searching for user');
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
