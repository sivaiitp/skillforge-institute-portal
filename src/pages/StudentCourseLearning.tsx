
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CourseLearningMaterialsSidebar } from "@/components/CourseLearningMaterialsSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { MaterialContentArea } from "@/components/course-learning/MaterialContentArea";
import { CourseLearningHeader } from "@/components/course-learning/CourseLearningHeader";

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
}

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [progressData, setProgressData] = useState([]);
  const { toggleMaterialCompletion, getStudyProgress, loading: progressLoading } = useStudyProgress();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    if (courseId) {
      fetchCourse();
      loadProgress();
    }
  }, [user, userRole, courseId, navigate]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      toast.error('Error fetching course details');
      console.error('Error:', error);
    }
  };

  const loadProgress = async () => {
    if (courseId) {
      const courseProgress = await getStudyProgress(courseId);
      setProgressData(courseProgress);
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleDownload = (material: Material) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
      toast.success(`Opening ${material.title}`);
    } else {
      toast.error('File not available');
    }
  };

  const handleMaterialCompletion = async (materialId: string) => {
    if (!courseId) return;
    
    const currentProgress = progressData.find(p => p.study_material_id === materialId);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(materialId, courseId, currentStatus);
    if (success) {
      await loadProgress();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {courseId && (
            <CourseLearningMaterialsSidebar 
              courseId={courseId}
              selectedMaterialId={selectedMaterial?.id || null}
              onSelectMaterial={handleMaterialSelect}
            />
          )}
          
          <SidebarInset className="flex-1">
            <CourseLearningHeader courseTitle={course?.title} />
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-4xl w-full">
                <MaterialContentArea
                  selectedMaterial={selectedMaterial}
                  progressData={progressData}
                  progressLoading={progressLoading}
                  onDownload={handleDownload}
                  onMaterialCompletion={handleMaterialCompletion}
                />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentCourseLearning;
