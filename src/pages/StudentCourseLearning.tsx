
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
  const [isLoading, setIsLoading] = useState(true);
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
      console.log('Material selected:', material);
    },
    onAssessmentSelect: () => {
      console.log('Assessment selected');
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
      initializeCourseData();
    }
  }, [user, userRole, courseId, navigate]);

  const initializeCourseData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchCourse(),
        fetchStudyMaterials(),
        loadProgress()
      ]);
    } catch (error) {
      console.error('Error initializing course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!user || isLoading) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <CourseLearningMaterialsSidebar 
          materials={studyMaterials}
          selectedMaterialId={selectedMaterial?.id || null}
          onMaterialSelect={handleMaterialSelect}
          progressData={progressData}
          courseDuration={course?.duration}
        />
        
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <CourseLearningHeader courseTitle={course?.title} />
          
          <main className="flex-1 p-6 overflow-auto">
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentCourseLearning;
