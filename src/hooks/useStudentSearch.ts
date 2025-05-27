
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
    setIsSearching(true);
    console.log('Fetching ALL users from database without any filters...');
    
    try {
      // Fetch ALL users without any filtering whatsoever
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      console.log('ALL USERS IN DATABASE (no filters):', { allUsers, error, count: allUsers?.length });

      if (error) {
        console.error('Error fetching all users:', error);
        toast.error('Error fetching users from database');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      if (!allUsers || allUsers.length === 0) {
        console.log('Database returned no users at all');
        toast.error('No users found in database');
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // Show all users found
      console.log('Users found:', allUsers.map(u => ({ 
        id: u.id, 
        name: u.full_name, 
        email: u.email, 
        role: u.role 
      })));

      // If search name is provided, filter by it, otherwise just pick the first user
      let matchingUsers = allUsers;
      
      if (searchName.trim()) {
        const searchTerm = searchName.trim().toLowerCase();
        matchingUsers = allUsers.filter(user => {
          const fullName = (user.full_name || '').toLowerCase();
          const email = (user.email || '').toLowerCase();
          return fullName.includes(searchTerm) || email.includes(searchTerm);
        });
        
        console.log(`Filtered by "${searchTerm}":`, matchingUsers);
      }

      if (matchingUsers.length === 0) {
        toast.error(`No user found matching "${searchName.trim()}"`);
        setSelectedStudent(null);
        setEnrolledCourses([]);
        return;
      }

      // Use the first matching user
      const selectedUser = matchingUsers[0];
      console.log('Selected user:', selectedUser);

      if (matchingUsers.length > 1) {
        toast.info(`Found ${matchingUsers.length} matches, selected: ${selectedUser.full_name || selectedUser.email}`);
      }

      setSelectedStudent({
        id: selectedUser.id,
        full_name: selectedUser.full_name || selectedUser.email || 'Unknown',
        email: selectedUser.email || ''
      });
      
      await fetchStudentEnrollments(selectedUser.id);
      toast.success(`Selected user: ${selectedUser.full_name || selectedUser.email} (Role: ${selectedUser.role || 'unknown'})`);
      
    } catch (error) {
      console.error('Error in search:', error);
      toast.error('Error searching for users');
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
