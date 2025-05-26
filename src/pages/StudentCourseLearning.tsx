
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CourseLearningMaterialsSidebar } from "@/components/CourseLearningMaterialsSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { useCourseLearningNavigation } from "@/hooks/useCourseLearningNavigation";
import { MaterialContentArea } from "@/components/course-learning/MaterialContentArea";
import { CourseLearningHeader } from "@/components/course-learning/CourseLearningHeader";

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
  sort_order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [studyMaterials, setStudyMaterials] = useState<Material[]>([]);
  const [progressData, setProgressData] = useState([]);
  const { toggleMaterialCompletion, getStudyProgress, loading: progressLoading } = useStudyProgress();

  const {
    selectedMaterial,
    hasNextMaterial,
    hasPreviousMaterial,
    goToNext,
    goToPrevious,
    handleMaterialSelect
  } = useCourseLearningNavigation({
    studyMaterials,
    assessments: [], // No assessments for now
    progressData,
    onMaterialSelect: (material) => {
      // This will be handled by the hook
    },
    onAssessmentSelect: () => {
      // This will be handled by the hook
    }
  });

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
      fetchStudyMaterials();
      loadProgress();
    }
  }, [user, userRole, courseId, navigate]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, duration')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      toast.error('Error fetching course details');
      console.error('Error:', error);
    }
  };

  const fetchStudyMaterials = async () => {
    if (!courseId) return;
    
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('id, title, mime_type, file_url, description, sort_order')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setStudyMaterials(data || []);
    } catch (error) {
      toast.error('Error fetching study materials');
      console.error('Error:', error);
    }
  };

  const loadProgress = async () => {
    if (courseId) {
      const courseProgress = await getStudyProgress(courseId);
      setProgressData(courseProgress);
    }
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
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <CourseLearningMaterialsSidebar 
          materials={studyMaterials}
          selectedMaterialId={selectedMaterial?.id || null}
          onMaterialSelect={handleMaterialSelect}
          progressData={progressData}
          courseDuration={course?.duration}
        />
        
        <SidebarInset className="flex-1 flex flex-col">
          <CourseLearningHeader courseTitle={course?.title} />
          
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <MaterialContentArea
                selectedMaterial={selectedMaterial}
                progressData={progressData}
                progressLoading={progressLoading}
                onDownload={handleDownload}
                onMaterialCompletion={handleMaterialCompletion}
                onNext={goToNext}
                onPrevious={goToPrevious}
                hasNext={hasNextMaterial()}
                hasPrevious={hasPreviousMaterial()}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentCourseLearning;
