
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: number;
  certification: string;
  image_url?: string;
  brochure_url?: string;
  detailed_description: string;
  prerequisites: string;
  learning_outcomes: string;
  is_featured: boolean;
  is_active: boolean;
}

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  certification: string;
  image_url: string;
  brochure_url: string;
  detailed_description: string;
  prerequisites: string;
  learning_outcomes: string;
  is_featured: boolean;
  is_active: boolean;
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  duration: '',
  level: '',
  category: '',
  price: '',
  certification: '',
  image_url: '',
  brochure_url: '',
  detailed_description: '',
  prerequisites: '',
  learning_outcomes: '',
  is_featured: false,
  is_active: true
};

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses: ' + error.message);
        return;
      }
      setCourses(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Course title is required');
      return;
    }

    try {
      setLoading(true);
      const courseData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      };

      let result;
      if (editingCourse) {
        result = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id)
          .select();
      } else {
        result = await supabase
          .from('courses')
          .insert([courseData])
          .select();
      }

      if (result.error) {
        console.error('Database error:', result.error);
        toast.error(`Error ${editingCourse ? 'updating' : 'creating'} course: ` + result.error.message);
        return;
      }

      toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    console.log('Editing course:', course);
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      level: course.level || '',
      category: course.category || '',
      price: course.price?.toString() || '',
      certification: course.certification || '',
      image_url: course.image_url || '',
      brochure_url: course.brochure_url || '',
      detailed_description: course.detailed_description || '',
      prerequisites: course.prerequisites || '',
      learning_outcomes: course.learning_outcomes || '',
      is_featured: course.is_featured || false,
      is_active: course.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Error deleting course: ' + error.message);
        return;
      }

      toast.success('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData(initialFormData);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    showForm,
    editingCourse,
    loading,
    formData,
    setFormData,
    setShowForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  };
};
