
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import CourseForm from '@/components/CourseForm';
import CourseTable from '@/components/CourseTable';

const CourseManagement = () => {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  const courseCategories = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'Database Management',
    'UI/UX Design',
    'Digital Marketing',
    'Project Management'
  ];

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCourses();
    }
  }, [userRole]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null
    };

    let error;
    if (editingCourse) {
      ({ error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id));
    } else {
      ({ error } = await supabase
        .from('courses')
        .insert([courseData]));
    }

    if (error) {
      toast.error(`Error ${editingCourse ? 'updating' : 'creating'} course`);
      return;
    }

    toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully!`);
    resetForm();
    fetchCourses();
  };

  const handleEdit = (course) => {
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

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      toast.error('Error deleting course');
      return;
    }

    toast.success('Course deleted successfully!');
    fetchCourses();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
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
    });
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div>Access denied</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-600">Add, edit, and remove courses</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Course
          </Button>
        </div>

        {showForm && (
          <CourseForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            editingCourse={editingCourse}
            courseCategories={courseCategories}
          />
        )}

        <CourseTable
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
