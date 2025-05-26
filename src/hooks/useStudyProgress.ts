
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
      const { data, error } = await supabase
        .from('user_study_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) throw error;
      return data || [];
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
      const newStatus = !currentStatus;
      const updateData = {
        user_id: user.id,
        study_material_id: studyMaterialId,
        course_id: courseId,
        completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_study_progress')
        .upsert(updateData, {
          onConflict: 'user_id,study_material_id'
        });

      if (error) throw error;

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

      // Get completed count
      const { data: progressData, error: progressError } = await supabase
        .from('user_study_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('completed', true);

      if (progressError) throw progressError;

      const total = materialsData?.length || 0;
      const completed = progressData?.length || 0;
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
