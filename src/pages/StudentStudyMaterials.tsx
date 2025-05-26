
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Video, FileImage, File, Search } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const StudentStudyMaterials = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");

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
    if (enrolledCourses.length > 0) {
      fetchStudyMaterials();
    }
  }, [enrolledCourses, selectedCourse]);

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

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1">
          <SidebarProvider>
            <div className="min-h-full flex w-full">
              <StudentSidebar />
              <SidebarInset className="flex-1">
                <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                  <SidebarTrigger className="-ml-1" />
                  <h1 className="text-xl font-semibold">Study Materials</h1>
                </header>
                
                <div className="flex-1 p-6 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Study Materials</h2>
                    <p className="text-gray-600">Access course materials and resources</p>
                  </div>

                  {/* Course Filter */}
                  <div className="flex items-center gap-4">
                    <Search className="h-5 w-5 text-gray-400" />
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="w-64">
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

                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>Loading study materials...</p>
                    </div>
                  ) : materials.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Study Materials</h3>
                        <p className="text-gray-600 mb-4">
                          {enrolledCourses.length === 0 
                            ? "You need to enroll in courses to access study materials."
                            : "No study materials available for your enrolled courses yet."
                          }
                        </p>
                        {enrolledCourses.length === 0 && (
                          <Button onClick={() => navigate('/courses')}>
                            Browse Courses
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {materials.map((material) => {
                        const FileIcon = getFileIcon(material.file_type);
                        
                        return (
                          <Card key={material.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <FileIcon className="h-8 w-8 text-blue-500" />
                                <Badge className={getFileTypeColor(material.file_type)}>
                                  {material.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg">{material.title}</CardTitle>
                              <CardDescription>{material.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600">
                                  Course: {material.courses?.title}
                                </div>
                                {material.file_size && (
                                  <div className="text-sm text-gray-600">
                                    Size: {(material.file_size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                )}
                                <div className="text-sm text-gray-600">
                                  Added: {new Date(material.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <Button 
                                className="w-full"
                                onClick={() => handleDownload(material)}
                                disabled={!material.file_url}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {material.file_url ? 'Download' : 'Not Available'}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default StudentStudyMaterials;
