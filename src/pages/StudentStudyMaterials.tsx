
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, ExternalLink, FileText, Video, Music, Image, Presentation } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  course_id: string;
  courses: {
    title: string;
    category: string;
  };
}

const StudentStudyMaterials = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

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
    fetchStudyMaterials();
  }, [user, userRole, navigate]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          courses (
            id,
            title,
            category
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setEnrolledCourses(data?.map(enrollment => enrollment.courses) || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
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
            title,
            category
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (selectedCourse !== 'all') {
        query = query.eq('course_id', selectedCourse);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStudyMaterials(data || []);
    } catch (error) {
      toast.error('Error fetching study materials');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchStudyMaterials();
    }
  }, [selectedCourse, user]);

  const getMaterialIcon = (materialType: string) => {
    switch (materialType) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'presentation':
        return <Presentation className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'link':
        return <ExternalLink className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const handleDownload = (material: StudyMaterial) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
      toast.success('Download started!');
    } else {
      toast.error('File not available for download');
    }
  };

  const handleView = (material: StudyMaterial) => {
    if (material.file_url) {
      if (material.material_type === 'link') {
        window.open(material.file_url, '_blank');
      } else {
        window.open(material.file_url, '_blank');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <StudentSidebar />
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">Study Materials</h1>
              </header>
              
              <div className="flex-1 p-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Study Materials</h2>
                  <p className="text-gray-600">Access course materials, PDFs, videos, and resources</p>
                </div>

                {/* Course Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCourse === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCourse('all')}
                    size="sm"
                  >
                    All Courses
                  </Button>
                  {enrolledCourses.map((course: any) => (
                    <Button
                      key={course.id}
                      variant={selectedCourse === course.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCourse(course.id)}
                      size="sm"
                    >
                      {course.title}
                    </Button>
                  ))}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading study materials...</p>
                  </div>
                ) : studyMaterials.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Study Materials</h3>
                      <p className="text-gray-600 mb-4">
                        {selectedCourse === 'all' 
                          ? "No study materials are available for your enrolled courses yet."
                          : "No study materials are available for this course yet."
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studyMaterials.map((material) => (
                      <Card key={material.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getMaterialIcon(material.material_type)}
                              <Badge variant="outline" className="text-xs">
                                {material.material_type}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-lg">{material.title}</CardTitle>
                          <CardDescription>
                            <span className="font-medium text-blue-600">
                              {material.courses?.title}
                            </span>
                            {material.description && (
                              <span className="block mt-1">{material.description}</span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            {material.file_size && (
                              <span>Size: {formatFileSize(material.file_size)}</span>
                            )}
                            {material.duration && (
                              <span>Duration: {material.duration}</span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              onClick={() => handleView(material)}
                              disabled={!material.file_url}
                            >
                              {material.material_type === 'link' ? 'Open Link' : 'View'}
                            </Button>
                            {material.is_downloadable && material.file_url && (
                              <Button 
                                variant="outline"
                                size="icon"
                                onClick={() => handleDownload(material)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentStudyMaterials;
