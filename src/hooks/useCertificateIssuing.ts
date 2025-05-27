
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface EnrolledCourse {
  id: string;
  title: string;
  enrollment_date: string;
  has_certificate: boolean;
}

export const useCertificateIssuing = () => {
  const [searchName, setSearchName] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isIssuingCertificate, setIsIssuingCertificate] = useState(false);

  const searchUsers = async () => {
    if (!searchName.trim()) {
      toast.error('Please enter a user name');
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for users with name containing:', searchName.trim());
      
      // Search ALL users in the profiles table - no role filter, no user restriction
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .ilike('full_name', `%${searchName.trim()}%`)
        .order('full_name');

      console.log('Search results:', { users, error, searchTerm: searchName.trim() });

      if (error) {
        console.error('Error searching users:', error);
        toast.error('Error searching for users');
        return;
      }

      if (!users || users.length === 0) {
        toast.error(`No users found with name containing "${searchName.trim()}"`);
        setSelectedUser(null);
        setEnrolledCourses([]);
        return;
      }

      // If multiple results, take the first one
      const foundUser = users[0];
      console.log('Found user:', foundUser);

      if (users.length > 1) {
        toast.info(`Found ${users.length} users, selected: ${foundUser.full_name}`);
      }

      setSelectedUser(foundUser);
      await fetchUserEnrollments(foundUser.id);
      toast.success(`Found user: ${foundUser.full_name}`);

    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Error searching for users');
      setSelectedUser(null);
      setEnrolledCourses([]);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchUserEnrollments = async (userId: string) => {
    if (!userId) {
      setEnrolledCourses([]);
      return;
    }

    setLoadingEnrollments(true);
    try {
      // Get user enrollments
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
        .eq('user_id', userId)
        .eq('status', 'active');

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        toast.error('Error fetching user enrollments');
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        setEnrolledCourses([]);
        return;
      }

      // Get existing certificates for this user
      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('course_id')
        .eq('user_id', userId)
        .eq('is_valid', true);

      if (certError) {
        console.error('Error fetching certificates:', certError);
      }

      const certificatedCourseIds = new Set(certificates?.map(cert => cert.course_id) || []);

      // Format the courses with certificate status
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
      console.error('Error fetching user enrollments:', error);
      toast.error('Error fetching user enrollments');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const issueCertificate = async () => {
    if (!selectedUser || !selectedCourse) {
      toast.error('Please select both user and course');
      return false;
    }

    const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);
    if (selectedCourseData?.has_certificate) {
      toast.error('User already has a certificate for this course');
      return false;
    }

    setIsIssuingCertificate(true);
    try {
      const certificateNumber = generateCertificateNumber();
      
      const { error } = await supabase
        .from('certificates')
        .insert({
          user_id: selectedUser.id,
          course_id: selectedCourse,
          certificate_number: certificateNumber,
          certificate_id: certificateNumber,
          issued_date: new Date().toISOString(),
          is_valid: true
        });

      if (error) {
        console.error('Error issuing certificate:', error);
        toast.error('Error issuing certificate');
        return false;
      }

      toast.success(`Certificate issued successfully! Number: ${certificateNumber}`);
      clearForm();
      return true;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
      return false;
    } finally {
      setIsIssuingCertificate(false);
    }
  };

  const clearForm = () => {
    setSelectedUser(null);
    setSearchName('');
    setEnrolledCourses([]);
    setSelectedCourse('');
  };

  return {
    searchName,
    setSearchName,
    selectedUser,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    selectedCourse,
    setSelectedCourse,
    isIssuingCertificate,
    searchUsers,
    issueCertificate,
    clearForm,
  };
};
