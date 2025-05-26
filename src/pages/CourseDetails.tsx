
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, CheckCircle, Award, Calendar, Target, Download } from 'lucide-react';
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

  // Parse learning outcomes or use default ones
  const learningOutcomes = course.learning_outcomes ? 
    course.learning_outcomes.split('\n').filter(item => item.trim()) : [
      'Master fundamental concepts and best practices',
      'Gain hands-on experience with real-world projects',
      'Develop industry-relevant skills and knowledge',
      'Build a strong foundation for career advancement',
      'Learn from expert instructors with industry experience',
      'Receive comprehensive study materials and resources',
      'Get certified upon successful completion'
    ];

  // Parse prerequisites or use default ones
  const prerequisites = course.prerequisites ? 
    course.prerequisites.split('\n').filter(item => item.trim()) : [
      'Basic computer literacy',
      'Passion for learning new technologies',
      'No prior experience required for beginner courses'
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="bg-white/20 text-white mb-4">
                {course.level} Level
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                {course.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>50+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>4.8 Rating</span>
                </div>
                {course.category && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.category}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={handleEnrollment}
                >
                  Enroll Now - ₹{course.price?.toLocaleString('en-IN')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600"
                  onClick={handleDownloadBrochure}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src={course.image_url || `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt={course.title}
                className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Course Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {course.detailed_description ? (
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {course.detailed_description}
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          This comprehensive {course.title.toLowerCase()} program is designed to provide you with 
                          the skills and knowledge needed to excel in today's competitive market. Our expert 
                          instructors bring years of industry experience to deliver practical, hands-on training.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Throughout this course, you'll work on real-world projects that simulate actual 
                          industry challenges. This approach ensures that you not only learn the theoretical 
                          concepts but also gain practical experience that employers value.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          Upon successful completion, you'll receive an industry-recognized certificate that 
                          validates your skills and enhances your career prospects.
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    {prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{course.price?.toLocaleString('en-IN')}
                    </div>
                    <p className="text-gray-600">One-time payment</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg" onClick={handleEnrollment}>
                    Enroll Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg" 
                    onClick={handleDownloadBrochure}
                    disabled={!course.brochure_url}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {course.brochure_url ? 'Download Brochure' : 'Brochure Not Available'}
                  </Button>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Flexible start dates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span>Certificate included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Expert instructors</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    {course.certification && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certificate:</span>
                        <Badge variant="outline">{course.certification}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                        ₹{relatedCourse.price?.toLocaleString('en-IN')}
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
