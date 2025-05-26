
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft, BookOpen, Video, FileText, Play } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CourseLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { getStudyProgress, toggleMaterialCompletion, getCourseProgress, loading } = useStudyProgress();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [courseProgress, setCourseProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
  }, [user, userRole, navigate]);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) throw new Error('Course ID is required');

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('Course not found');
      
      return data;
    },
    enabled: !!id
  });

  const { data: studyMaterials, isLoading: materialsLoading } = useQuery({
    queryKey: ['study-materials', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('course_id', id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (id) {
        const progress = await getStudyProgress(id);
        const courseProgressData = await getCourseProgress(id);
        setProgressData(progress);
        setCourseProgress(courseProgressData);
      }
    };
    
    if (studyMaterials?.length > 0) {
      loadProgress();
    }
  }, [id, studyMaterials]);

  const handleMaterialCompletion = async (materialId: string) => {
    if (!id) return;
    
    const currentProgress = progressData.find(p => p.study_material_id === materialId);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(materialId, id, currentStatus);
    if (success) {
      // Refresh progress data
      const updatedProgress = await getStudyProgress(id);
      const updatedCourseProgress = await getCourseProgress(id);
      setProgressData(updatedProgress);
      setCourseProgress(updatedCourseProgress);
    }
  };

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const getFileIcon = (materialType: string) => {
    if (materialType?.includes('video')) return Video;
    if (materialType?.includes('pdf')) return FileText;
    return BookOpen;
  };

  if (!user) return null;

  if (courseLoading || materialsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading course materials...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/courses')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Courses
          </Button>
          
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-800 mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-lg">{course.description}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {course.level}
                </Badge>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Course Progress</span>
                  <span className="text-sm text-blue-600 font-semibold">
                    {courseProgress.completed}/{courseProgress.total} materials completed ({courseProgress.percentage}%)
                  </span>
                </div>
                <Progress value={courseProgress.percentage} className="w-full h-3" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Study Materials */}
        <div className="grid lg:grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Study Materials</h2>
            
            {studyMaterials?.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No study materials available yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {studyMaterials?.map((material) => {
                  const progress = getMaterialProgress(material.id);
                  const isCompleted = progress?.completed || false;
                  const Icon = getFileIcon(material.material_type);
                  
                  return (
                    <Card key={material.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Icon className={`h-6 w-6 ${isCompleted ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">{material.title}</h3>
                                <p className="text-gray-600 mb-4">{material.description}</p>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                  <Badge variant="outline" className="bg-gray-50">
                                    {material.material_type}
                                  </Badge>
                                  {material.duration && (
                                    <span className="flex items-center gap-1">
                                      <Play className="w-3 h-3" />
                                      {material.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            {/* Material Content Preview */}
                            {material.file_url && (
                              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                {material.material_type?.includes('video') ? (
                                  <div className="text-center">
                                    <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Video content available</p>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-2"
                                      onClick={() => window.open(material.file_url, '_blank')}
                                    >
                                      Watch Video
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Document available for download</p>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-2"
                                      onClick={() => window.open(material.file_url, '_blank')}
                                    >
                                      Open Document
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Completion Button */}
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-500">
                                {isCompleted && progress?.completed_at && (
                                  <span>Completed on {new Date(progress.completed_at).toLocaleDateString()}</span>
                                )}
                              </div>
                              
                              <Button
                                onClick={() => handleMaterialCompletion(material.id)}
                                disabled={loading}
                                variant={isCompleted ? "default" : "outline"}
                                className={isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                              >
                                {isCompleted ? (
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseLearning;
