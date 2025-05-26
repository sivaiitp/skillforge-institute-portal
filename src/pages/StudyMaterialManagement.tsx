
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import StudyMaterialsHeader from '@/components/study-materials/StudyMaterialsHeader';
import CourseFilter from '@/components/study-materials/CourseFilter';
import StudyMaterialForm from '@/components/study-materials/StudyMaterialForm';
import StudyMaterialsGrid from '@/components/study-materials/StudyMaterialsGrid';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  duration: string;
  is_downloadable: boolean;
  sort_order: number;
  is_active: boolean;
  course_id: string;
  courses: {
    title: string;
    category: string;
  };
}

interface Course {
  id: string;
  title: string;
  category: string;
}

const StudyMaterialManagement = () => {
  const { userRole } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    material_type: 'pdf',
    file_url: '',
    file_size: 0,
    mime_type: '',
    file_extension: '',
    duration: '',
    is_downloadable: true,
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCourses();
      fetchMaterials();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchMaterials();
    }
  }, [selectedCourse, userRole]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, category')
      .eq('is_active', true)
      .order('title');
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const fetchMaterials = async () => {
    let query = supabase
      .from('study_materials')
      .select(`
        *,
        courses (
          title,
          category
        )
      `)
      .order('sort_order', { ascending: true });

    if (selectedCourse !== 'all') {
      query = query.eq('course_id', selectedCourse);
    }

    const { data, error } = await query;
    
    if (error) {
      toast.error('Error fetching study materials');
      return;
    }
    setMaterials(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.course_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    let error;
    if (editingMaterial) {
      ({ error } = await supabase
        .from('study_materials')
        .update(formData)
        .eq('id', editingMaterial.id));
    } else {
      ({ error } = await supabase
        .from('study_materials')
        .insert([formData]));
    }

    if (error) {
      toast.error(`Error ${editingMaterial ? 'updating' : 'creating'} study material`);
      return;
    }

    toast.success(`Study material ${editingMaterial ? 'updated' : 'created'} successfully!`);
    resetForm();
    fetchMaterials();
  };

  const handleEdit = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      course_id: material.course_id,
      material_type: material.material_type,
      file_url: material.file_url || '',
      file_size: material.file_size || 0,
      mime_type: material.mime_type || '',
      file_extension: material.file_extension || '',
      duration: material.duration || '',
      is_downloadable: material.is_downloadable,
      sort_order: material.sort_order,
      is_active: material.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;

    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      toast.error('Error deleting study material');
      return;
    }

    toast.success('Study material deleted successfully!');
    fetchMaterials();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
    setFormData({
      title: '',
      description: '',
      course_id: '',
      material_type: 'pdf',
      file_url: '',
      file_size: 0,
      mime_type: '',
      file_extension: '',
      duration: '',
      is_downloadable: true,
      sort_order: 0,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        <StudyMaterialsHeader
          materialsCount={materials.length}
          activeCount={materials.filter(m => m.is_active).length}
          downloadableCount={materials.filter(m => m.is_downloadable).length}
          coursesCount={courses.length}
          onAddMaterial={() => setShowForm(true)}
        />

        <CourseFilter
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
        />

        <StudyMaterialsGrid
          materials={materials}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddFirst={() => setShowForm(true)}
          selectedCourse={selectedCourse}
        />

        <StudyMaterialForm
          isOpen={showForm}
          onClose={resetForm}
          onSubmit={handleSubmit}
          formData={formData}
          onFormDataChange={setFormData}
          courses={courses}
          editingMaterial={editingMaterial}
        />
      </div>
    </div>
  );
};

export default StudyMaterialManagement;
