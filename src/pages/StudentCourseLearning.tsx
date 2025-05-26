
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CourseLearningMaterialsSidebar } from "@/components/CourseLearningMaterialsSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_url: string;
  file_size: number;
}

const StudentCourseLearning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
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
    
    if (courseId) {
      fetchCourse();
    }
  }, [user, userRole, navigate, courseId]);

  useEffect(() => {
    const loadProgress = async () => {
      if (courseId) {
        const courseProgress = await getStudyProgress(courseId);
        setProgressData(courseProgress);
      }
    };
    
    loadProgress();
  }, [courseId, selectedMaterial]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    setLoading(true);
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
    setLoading(false);
  };

  const handleSelectMaterial = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleDownload = () => {
    if (selectedMaterial?.file_url) {
      window.open(selectedMaterial.file_url, '_blank');
      toast.success(`Downloading ${selectedMaterial.title}`);
    } else {
      toast.error('File not available for download');
    }
  };

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const handleMaterialCompletion = async () => {
    if (!selectedMaterial || !courseId) return;
    
    const currentProgress = getMaterialProgress(selectedMaterial.id);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(selectedMaterial.id, courseId, currentStatus);
    if (success) {
      const courseProgress = await getStudyProgress(courseId);
      setProgressData(courseProgress);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const materialProgress = selectedMaterial ? getMaterialProgress(selectedMaterial.id) : null;
  const isCompleted = materialProgress?.completed || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {courseId && (
            <CourseLearningMaterialsSidebar
              courseId={courseId}
              selectedMaterialId={selectedMaterial?.id || null}
              onSelectMaterial={handleSelectMaterial}
            />
          )}
          
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/courses')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Button>
              <div className="flex items-center gap-3 ml-4">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {course?.title || 'Course Learning'}
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-4xl w-full">
                {!selectedMaterial ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Select a Material</h3>
                      <p className="text-gray-600 text-lg">
                        Choose a study material from the sidebar to begin learning
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <CardTitle className="text-2xl">{selectedMaterial.title}</CardTitle>
                      {selectedMaterial.description && (
                        <p className="text-blue-100 mt-2">{selectedMaterial.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">File Type</div>
                          <div className="font-medium">
                            {selectedMaterial.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                          </div>
                        </div>
                        {selectedMaterial.file_size && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600">File Size</div>
                            <div className="font-medium">
                              {(selectedMaterial.file_size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        )}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Status</div>
                          <div className={`font-medium flex items-center gap-2 ${isCompleted ? 'text-green-600'  : 'text-gray-800'}`}>
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Circle className="h-4 w-4" />
                                Not Completed
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-8">
                        <Button
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          disabled={!selectedMaterial.file_url}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Material
                        </Button>
                        
                        <Button
                          onClick={handleMaterialCompletion}
                          variant={isCompleted ? "outline" : "default"}
                          className={isCompleted ? "border-green-300" : "bg-green-600 hover:bg-green-700"}
                          disabled={progressLoading}
                        >
                          {isCompleted ? (
                            <>
                              <Circle className="h-4 w-4 mr-2" />
                              Mark as Incomplete
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark as Complete
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentCourseLearning;
