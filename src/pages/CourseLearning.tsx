
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedCourseLearning from "@/components/EnhancedCourseLearning";

const CourseLearning = () => {
  const { courseId } = useParams(); // Changed from 'id' to 'courseId' to match the route
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
  }, [user, userRole, navigate]);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');

      console.log('Fetching course with ID:', courseId);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('Course fetch error:', error);
        throw error;
      }
      if (!data) {
        console.log('No course found with ID:', courseId);
        throw new Error('Course not found');
      }
      
      console.log('Course found:', data);
      return data;
    },
    enabled: !!courseId
  });

  const { data: studyMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ['study-materials', courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments', courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!courseId
  });

  if (!user) return null;

  if (courseLoading || materialsLoading || assessmentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading course materials...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-4">Course ID: {courseId}</p>
            <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <EnhancedCourseLearning
        course={course}
        studyMaterials={studyMaterials || []}
        assessments={assessments || []}
        onBack={() => navigate('/dashboard')}
      />

      <Footer />
    </div>
  );
};

export default CourseLearning;
