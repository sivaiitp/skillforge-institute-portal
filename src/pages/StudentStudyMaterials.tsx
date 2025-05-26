import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Video, FileImage, File, Search, BookOpen, FolderOpen, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { useStudyProgress } from "@/hooks/useStudyProgress";

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
    // Set selected course from URL parameter
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

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return FileText;
    if (fileType?.includes('video')) return Video;
    if (fileType?.includes('image')) return FileImage;
    return File;
  };

  const getFileTypeColor = (fileType) => {
    if (fileType?.includes('pdf')) return 'bg-red-100 text-red-800';
    if (fileType?.includes('video')) return 'bg-blue-100 text-blue-800';
    if (fileType?.includes('image')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleDownload = (material) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
      toast.success(`Downloading ${material.title}`);
    } else {
      toast.error('File not available for download');
    }
  };

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const handleMaterialCompletion = async (materialId: string, courseId: string) => {
    const currentProgress = getMaterialProgress(materialId);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(materialId, courseId, currentStatus);
    if (success) {
      // Refresh progress data
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

                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-emerald-100">
                    <Search className="h-5 w-5 text-emerald-500" />
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="w-64 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Filter by course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {enrolledCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading study materials...</p>
                  </div>
                ) : materials.length === 0 ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <FolderOpen className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Study Materials</h3>
                      <p className="text-gray-600 mb-8 text-lg">
                        {enrolledCourses.length === 0 
                          ? "You need to enroll in courses to access study materials."
                          : "No study materials available for your enrolled courses yet."
                        }
                      </p>
                      {enrolledCourses.length === 0 && (
                        <Button 
                          onClick={() => navigate('/courses')}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 text-lg"
                        >
                          Browse Courses
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((material) => {
                      const FileIcon = getFileIcon(material.file_type);
                      const progress = getMaterialProgress(material.id);
                      const isCompleted = progress?.completed || false;
                      
                      return (
                        <Card key={material.id} className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-6 text-white">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                            <div className="relative z-10 flex items-start justify-between">
                              <FileIcon className="h-10 w-10 text-emerald-100" />
                              <div className="flex items-center gap-2">
                                <Badge className={`${getFileTypeColor(material.file_type)} border-0`}>
                                  {material.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </Badge>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-200" />
                                ) : (
                                  <Circle className="w-5 h-5 text-white/50" />
                                )}
                              </div>
                            </div>
                            <div className="relative z-10 mt-4">
                              <CardTitle className="text-xl text-white mb-2 line-clamp-2">{material.title}</CardTitle>
                              <CardDescription className="text-emerald-100 line-clamp-2">
                                {material.description}
                              </CardDescription>
                            </div>
                          </div>
                          
                          <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <BookOpen className="w-4 h-4 mr-3 text-emerald-500" />
                                <div>
                                  <div className="font-medium text-gray-800">Course</div>
                                  <div className="line-clamp-1">{material.courses?.title}</div>
                                </div>
                              </div>
                              {material.file_size && (
                                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  <File className="w-4 h-4 mr-3 text-teal-500" />
                                  <div>
                                    <div className="font-medium text-gray-800">Size</div>
                                    <div>{(material.file_size / 1024 / 1024).toFixed(2)} MB</div>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <FileText className="w-4 h-4 mr-3 text-emerald-500" />
                                <div>
                                  <div className="font-medium text-gray-800">Added</div>
                                  <div>{new Date(material.created_at).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                                onClick={() => handleDownload(material)}
                                disabled={!material.file_url}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {material.file_url ? 'Download Material' : 'Not Available'}
                              </Button>
                              
                              <Button
                                onClick={() => handleMaterialCompletion(material.id, material.course_id)}
                                disabled={progressLoading}
                                variant={isCompleted ? "default" : "outline"}
                                className={`w-full ${isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
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
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
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
