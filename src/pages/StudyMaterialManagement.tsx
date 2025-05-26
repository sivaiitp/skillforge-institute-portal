
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/AdminSidebar';
import StudyMaterialsHeader from '@/components/study-materials/StudyMaterialsHeader';
import StudyMaterialForm from '@/components/study-materials/StudyMaterialForm';

interface Course {
  id: string;
  title: string;
  category: string;
  material_count?: number;
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

const StudyMaterialManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
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
    
    fetchCoursesWithMaterialCount();
  }, [user, userRole, navigate]);

  const fetchCoursesWithMaterialCount = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, category')
        .order('title');

      if (coursesError) throw coursesError;

      // Fetch material counts for each course
      const coursesWithCounts = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { count, error } = await supabase
            .from('study_materials')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);

          if (error) {
            console.error('Error fetching material count for course:', course.id, error);
            return { ...course, material_count: 0 };
          }

          return { ...course, material_count: count || 0 };
        })
      );

      setCourses(coursesWithCounts);
    } catch (error) {
      toast.error('Error fetching courses');
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
      fetchCoursesWithMaterialCount();
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
    setFormData(initialFormData);
  };

  const handleAddFirst = () => {
    setShowForm(true);
  };

  const navigateToCourseMaterials = (courseId: string, courseTitle: string) => {
    navigate(`/admin/study-materials/course/${courseId}?title=${encodeURIComponent(courseTitle)}`);
  };

  if (!user) return null;

  // Calculate stats for the header
  const totalMaterials = courses.reduce((sum, course) => sum + (course.material_count || 0), 0);
  const activeMaterials = totalMaterials; // Assuming all are active for now
  const downloadableMaterials = totalMaterials; // Assuming all are downloadable for now
  const coursesCount = courses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Study Material Management
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <StudyMaterialsHeader 
                  materialsCount={totalMaterials}
                  activeCount={activeMaterials}
                  downloadableCount={downloadableMaterials}
                  coursesCount={coursesCount}
                  onAddMaterial={() => setShowForm(true)}
                />

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Courses Found</h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        Create courses first before adding study materials.
                      </p>
                      <Button 
                        onClick={() => navigate('/admin/courses')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 text-lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Course
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} className="bg-white shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-5 h-5 text-blue-500" />
                              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {course.category}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <CardTitle className="text-lg text-gray-800 line-clamp-2">{course.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-emerald-600">
                              {course.material_count || 0} Materials
                            </span>
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          <Button
                            onClick={() => navigateToCourseMaterials(course.id, course.title)}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                          >
                            View Materials
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
    </div>
  );
};

export default StudyMaterialManagement;
