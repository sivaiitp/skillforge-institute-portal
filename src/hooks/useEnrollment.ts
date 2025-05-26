
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export const useEnrollment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          progress: 0
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You are already enrolled in this course');
        } else {
          toast.error('Failed to enroll in course: ' + error.message);
        }
        return false;
      }

      toast.success('Successfully enrolled in course!');
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) {
        console.error('Error checking enrollment:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  };

  const goToCourse = (courseId: string) => {
    // Navigate to the student dashboard courses page where they can access the course
    navigate('/dashboard/courses');
    toast.success('Redirecting to your courses...');
  };

  return {
    enrollInCourse,
    checkEnrollmentStatus,
    goToCourse,
    loading
  };
};
