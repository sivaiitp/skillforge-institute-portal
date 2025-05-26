
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CourseHero from '@/components/CourseHero';
import CourseContent from '@/components/CourseContent';
import CourseSidebar from '@/components/CourseSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useQuery({
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

  const { data: relatedCourses } = useQuery({
    queryKey: ['related-courses', course?.category],
    queryFn: async () => {
      if (!course?.category) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', course.category)
        .neq('id', id)
        .eq('is_active', true)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!course?.category
  });

  const handleEnrollment = () => {
    toast.success('Enrollment process initiated! Please contact us to complete your registration.');
  };

  const handleDownloadBrochure = () => {
    if (course?.brochure_url) {
      window.open(course.brochure_url, '_blank');
      toast.success('Brochure download started!');
    } else {
      toast.error('Brochure not available for this course');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading course details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
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
      
      {/* Hero Section */}
      <CourseHero 
        course={course}
        onEnroll={handleEnrollment}
        onDownloadBrochure={handleDownloadBrochure}
      />

      {/* Course Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <CourseContent course={course} />
            <CourseSidebar 
              course={course}
              onEnroll={handleEnrollment}
              onDownloadBrochure={handleDownloadBrochure}
            />
          </div>
        </div>
      </section>

      {/* Related Courses */}
      {relatedCourses && relatedCourses.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">More {course.category} Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCourses.map((relatedCourse) => (
                <Card key={relatedCourse.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(`/courses/${relatedCourse.id}`)}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedCourse.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={relatedCourse.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {relatedCourse.level}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {relatedCourse.title}
                    </CardTitle>
                    <CardDescription>{relatedCourse.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{relatedCourse.price?.toLocaleString('en-IN') || '0'}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetails;
