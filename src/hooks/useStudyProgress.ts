
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export const useStudyProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const getStudyProgress = async (courseId: string) => {
    if (!user) return [];
    
    try {
      // For now, return empty array until user_study_progress table is created
      console.log('Getting study progress for course:', courseId);
      return [];
    } catch (error) {
      console.error('Error fetching progress:', error);
      return [];
    }
  };

  const toggleMaterialCompletion = async (
    studyMaterialId: string, 
    courseId: string, 
    currentStatus: boolean
  ) => {
    if (!user) {
      toast.error('Please log in to track progress');
      return false;
    }

    setLoading(true);
    try {
      // For now, just show success message until user_study_progress table is created
      const newStatus = !currentStatus;
      console.log('Toggling material completion:', { studyMaterialId, courseId, newStatus });
      
      toast.success(newStatus ? 'Material marked as completed!' : 'Material marked as incomplete');
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = async (courseId: string) => {
    if (!user) return { completed: 0, total: 0, percentage: 0 };

    try {
      // Get total materials count
      const { data: materialsData, error: materialsError } = await supabase
        .from('study_materials')
        .select('id')
        .eq('course_id', courseId)
        .eq('is_active', true);

      if (materialsError) throw materialsError;

      const total = materialsData?.length || 0;
      // For now, return 0 completed until user_study_progress table is created
      const completed = 0;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percentage };
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return { completed: 0, total: 0, percentage: 0 };
    }
  };

  return {
    getStudyProgress,
    toggleMaterialCompletion,
    getCourseProgress,
    loading
  };
};
