
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
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
        <div className="ml-64 p-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeCourses = courses.filter(c => c.is_active).length;
  const featuredCourses = courses.filter(c => c.is_featured).length;
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-1">Course Management</h1>
                  <p className="text-gray-600">Add, edit, and manage courses</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowForm(true)} 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Course
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Active Courses</p>
                    <p className="text-2xl font-bold text-gray-800">{activeCourses}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Featured Courses</p>
                    <p className="text-2xl font-bold text-gray-800">{featuredCourses}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Total Value</p>
                    <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                editingCourse={editingCourse}
                courseCategories={courseCategories}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border">
          <CourseTable
            courses={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
