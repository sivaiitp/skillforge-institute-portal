
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CourseHero from "@/components/CourseHero";
import CourseSidebar from "@/components/CourseSidebar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEnrollment } from "@/hooks/useEnrollment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, Award, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrollInCourse, checkEnrollmentStatus, goToCourse, loading } = useEnrollment();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: isEnrolled, isLoading: enrollmentLoading, refetch: refetchEnrollment } = useQuery({
    queryKey: ['enrollment', id, user?.id],
    queryFn: () => checkEnrollmentStatus(id!),
    enabled: !!user && !!id
  });

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      navigate('/auth');
      return;
    }

    const success = await enrollInCourse(id!);
    if (success) {
      refetchEnrollment();
    }
  };

  const handleGoToCourse = () => {
    goToCourse(id!);
  };

  const handleDownloadBrochure = () => {
    if (course?.brochure_url) {
      window.open(course.brochure_url, '_blank');
      toast.success('Brochure downloaded successfully!');
    } else {
      toast.error('Brochure not available for this course');
    }
  };

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const syllabus = [
    "Introduction to Web Technologies",
    "Frontend Development with React",
    "Backend Development with Node.js",
    "Database Design and Management",
    "API Development and Integration",
    "Deployment and DevOps Basics",
    "Project Development and Portfolio Building"
  ];

  const highlights = [
    "Hands-on project-based learning",
    "Industry-relevant curriculum",
    "Expert instructor guidance",
    "Career placement assistance",
    "Lifetime access to course materials",
    "Community support and networking"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <CourseHero 
        course={course} 
        onDownloadBrochure={handleDownloadBrochure}
        isEnrolled={isEnrolled}
        onEnroll={handleEnroll}
        onGoToCourse={handleGoToCourse}
        loading={loading}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Course Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About This Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {course.detailed_description || course.description}
                  </p>
                </CardContent>
              </Card>

              {/* Course Syllabus */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Course Syllabus
                  </CardTitle>
                  <CardDescription>
                    Comprehensive curriculum designed to build your expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {syllabus.map((topic, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-800">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-600" />
                    Why Choose This Course?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <CourseSidebar 
                course={course} 
                onDownloadBrochure={handleDownloadBrochure}
                isEnrolled={isEnrolled}
                onEnroll={handleEnroll}
                onGoToCourse={handleGoToCourse}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetails;
