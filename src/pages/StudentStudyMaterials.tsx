
import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { MaterialsGrid } from "@/components/student-materials/MaterialsGrid";
import { MaterialsFilter } from "@/components/student-materials/MaterialsFilter";
import { EmptyState } from "@/components/student-materials/EmptyState";

const StudentStudyMaterials = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const { toggleMaterialCompletion, getStudyProgress, loading: progressLoading } = useStudyProgress();
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchEnrolledCourses();
  }, [user, userRole, navigate]);

  useEffect(() => {
    const courseFromUrl = searchParams.get('course');
    if (courseFromUrl) {
      setSelectedCourse(courseFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchStudyMaterials();
    }
  }, [enrolledCourses, selectedCourse]);

  useEffect(() => {
    const loadProgress = async () => {
      if (enrolledCourses.length > 0) {
        const allProgress = [];
        for (const course of enrolledCourses) {
          const courseProgress = await getStudyProgress(course.id);
          allProgress.push(...courseProgress);
        }
        setProgressData(allProgress);
      }
    };
    
    if (materials.length > 0) {
      loadProgress();
    }
  }, [materials, enrolledCourses]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          courses (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      
      const courses = data?.map(enrollment => enrollment.courses).filter(Boolean) || [];
      setEnrolledCourses(courses);
    } catch (error) {
      toast.error('Error fetching enrolled courses');
      console.error('Error:', error);
    }
  };

  const fetchStudyMaterials = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('study_materials')
        .select(`
          *,
          courses (
            id,
            title
          )
        `)
        .in('course_id', enrolledCourses.map(course => course.id))
        .order('created_at', { ascending: false });

      if (selectedCourse && selectedCourse !== "all") {
        query = query.eq('course_id', selectedCourse);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setMaterials(data || []);
    } catch (error) {
      toast.error('Error fetching study materials');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownload = (material) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
      toast.success(`Downloading ${material.title}`);
    } else {
      toast.error('File not available for download');
    }
  };

  const handleMaterialCompletion = async (materialId: string, courseId: string) => {
    const currentProgress = progressData.find(p => p.study_material_id === materialId);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(materialId, courseId, currentStatus);
    if (success) {
      const allProgress = [];
      for (const course of enrolledCourses) {
        const courseProgress = await getStudyProgress(course.id);
        allProgress.push(...courseProgress);
      }
      setProgressData(allProgress);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Study Materials
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Study Materials
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Access your course materials and resources for enhanced learning
                  </p>
                </div>

                <MaterialsFilter 
                  selectedCourse={selectedCourse}
                  onCourseChange={setSelectedCourse}
                  enrolledCourses={enrolledCourses}
                />

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading study materials...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <EmptyState enrolledCoursesCount={enrolledCourses.length} />
                ) : (
                  <MaterialsGrid 
                    materials={materials}
                    progressData={progressData}
                    onDownload={handleDownload}
                    onToggleCompletion={handleMaterialCompletion}
                    progressLoading={progressLoading}
                  />
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentStudyMaterials;
