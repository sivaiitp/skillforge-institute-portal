
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { EnrolledCourse } from '@/types/certificateIssuing';

export const useUserEnrollments = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const fetchUserEnrollments = useCallback(async (userId: string) => {
    if (!userId) {
      setEnrolledCourses([]);
      return;
    }

    setLoadingEnrollments(true);
    try {
      console.log('Fetching enrollments for user:', userId);
      
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
        setEnrolledCourses([]);
        return;
      }

      console.log('Enrollments fetched:', enrollments);

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

      console.log('Formatted courses:', formattedCourses);
      setEnrolledCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      toast.error('Error fetching user enrollments');
      setEnrolledCourses([]);
    } finally {
      setLoadingEnrollments(false);
    }
  }, []);

  return {
    enrolledCourses,
    setEnrolledCourses,
    loadingEnrollments,
    fetchUserEnrollments,
  };
};
