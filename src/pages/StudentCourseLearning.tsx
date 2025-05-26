import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CourseLearningMaterialsSidebar } from "@/components/CourseLearningMaterialsSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const handleMaterialCompletion = async (materialId: string) => {
    if (!courseId) return;
    
    const currentProgress = getMaterialProgress(materialId);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(materialId, courseId, currentStatus);
    if (success) {
      await loadProgress();
    }
  };

  const isMarkdownFile = (material: Material) => {
    if (!material.file_url) return false;
    const url = material.file_url.toLowerCase();
    return url.endsWith('.md') || url.endsWith('.markdown') || material.mime_type?.includes('markdown');
  };

  const renderMaterialContent = () => {
    if (!selectedMaterial) {
      return (
        <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent>
            <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Select a Material</h3>
            <p className="text-gray-600 text-lg">
              Choose a study material from the sidebar to begin learning
            </p>
          </CardContent>
        </Card>
      );
    }

    if (isMarkdownFile(selectedMaterial)) {
      return (
        <div className="space-y-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">{selectedMaterial.title}</CardTitle>
              {selectedMaterial.description && (
                <p className="text-gray-600">{selectedMaterial.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Type:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    MARKDOWN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getMaterialProgress(selectedMaterial.id)?.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              <Button
                onClick={() => handleMaterialCompletion(selectedMaterial.id)}
                disabled={progressLoading}
                variant={getMaterialProgress(selectedMaterial.id)?.completed ? "default" : "outline"}
                className={`w-full ${getMaterialProgress(selectedMaterial.id)?.completed ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              >
                {getMaterialProgress(selectedMaterial.id)?.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <MarkdownRenderer 
            filePath={selectedMaterial.file_url} 
            className="border-0 bg-white/80 backdrop-blur-sm shadow-xl"
          />
        </div>
      );
    }

    // Default material view for non-markdown files
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">{selectedMaterial.title}</CardTitle>
          {selectedMaterial.description && (
            <p className="text-gray-600">{selectedMaterial.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Type:</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {selectedMaterial.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getMaterialProgress(selectedMaterial.id)?.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => handleDownload(selectedMaterial)}
              disabled={!selectedMaterial.file_url}
            >
              <Download className="w-4 h-4 mr-2" />
              {selectedMaterial.file_url ? 'Open Material' : 'Not Available'}
            </Button>
            
            <Button
              onClick={() => handleMaterialCompletion(selectedMaterial.id)}
              disabled={progressLoading}
              variant={getMaterialProgress(selectedMaterial.id)?.completed ? "default" : "outline"}
              className={`w-full ${getMaterialProgress(selectedMaterial.id)?.completed ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
              {getMaterialProgress(selectedMaterial.id)?.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Incomplete
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {course?.title || 'Course Learning'}
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-4xl w-full">
                {renderMaterialContent()}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentCourseLearning;
