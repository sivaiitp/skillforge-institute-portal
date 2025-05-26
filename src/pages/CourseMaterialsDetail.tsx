import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import StudyMaterialsGrid from '@/components/study-materials/StudyMaterialsGrid';
import StudyMaterialForm from '@/components/study-materials/StudyMaterialForm';

interface Course {
  id: string;
  title: string;
  category: string;
}

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

interface FormData {
  title: string;
  description: string;
  course_id: string;
  material_type: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  duration: string;
  is_downloadable: boolean;
  sort_order: number;
  is_active: boolean;
}

const initialFormData: FormData = {
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
};

const CourseMaterialsDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseTitle = searchParams.get('title') || 'Course Materials';
  const { user, userRole } = useAuth();
  
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({ ...initialFormData, course_id: courseId || '' });
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    if (!courseId) {
      navigate('/admin/study-materials');
      return;
    }
    
    fetchCourses();
    fetchMaterials();
  }, [user, userRole, navigate, courseId]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, category')
        .order('title');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast.error('Error fetching courses');
      console.error('Error:', error);
    }
  };

  const fetchMaterials = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_materials')
        .select(`
          *,
          courses (
            title,
            category
          )
        `)
        .eq('course_id', courseId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      toast.error('Error fetching study materials');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Material title is required');
      return;
    }

    if (!formData.course_id) {
      toast.error('Please select a course');
      return;
    }

    try {
      setLoading(true);

      let result;
      if (editingMaterial) {
        result = await supabase
          .from('study_materials')
          .update(formData)
          .eq('id', editingMaterial.id)
          .select();
      } else {
        result = await supabase
          .from('study_materials')
          .insert([formData])
          .select();
      }

      if (result.error) {
        console.error('Database error:', result.error);
        toast.error(`Error ${editingMaterial ? 'updating' : 'creating'} study material: ` + result.error.message);
        return;
      }

      toast.success(`Study material ${editingMaterial ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title || '',
      description: material.description || '',
      course_id: material.course_id || '',
      material_type: material.material_type || 'pdf',
      file_url: material.file_url || '',
      file_size: material.file_size || 0,
      mime_type: material.mime_type || '',
      file_extension: material.file_extension || '',
      duration: material.duration || '',
      is_downloadable: material.is_downloadable !== false,
      sort_order: material.sort_order || 0,
      is_active: material.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (materialId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', materialId);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Error deleting study material: ' + error.message);
        return;
      }

      toast.success('Study material deleted successfully!');
      fetchMaterials();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
    setFormData({ ...initialFormData, course_id: courseId || '' });
  };

  const handleAddFirst = () => {
    setFormData({ ...initialFormData, course_id: courseId || '' });
    setShowForm(true);
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
            <SidebarTrigger className="-ml-1" />
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/study-materials')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          </header>
          
          <div className="flex-1 flex justify-center">
            <div className="p-8 space-y-8 max-w-7xl w-full">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {courseTitle} - Study Materials
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage study materials for this course
                  </p>
                </div>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                  <p className="text-lg text-gray-600">Loading study materials...</p>
                </div>
              ) : (
                <StudyMaterialsGrid
                  materials={materials}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddFirst={handleAddFirst}
                  selectedCourse={courseId || ''}
                />
              )}

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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CourseMaterialsDetail;
