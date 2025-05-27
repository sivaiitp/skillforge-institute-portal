
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedCourses from "@/components/FeaturedCourses";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useHomepageContent } from "@/hooks/useSiteSettings";
import { TrendingUp, Users, Award, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: homepageContent } = useHomepageContent();

  // Get stats content
  const statsContent = homepageContent?.filter(item => item.section.startsWith('stats_'));
  const ctaContent = homepageContent?.find(item => item.section === 'cta');

  const coursesCount = statsContent?.find(item => item.section === 'stats_courses')?.title || "50+";
  const studentsCount = statsContent?.find(item => item.section === 'stats_students')?.title || "500+";
  const placementRate = statsContent?.find(item => item.section === 'stats_placement')?.title || "95%";
  const experienceYears = statsContent?.find(item => item.section === 'stats_experience')?.title || "10+";

  const ctaTitle = ctaContent?.title || "Ready to Start Your Journey?";
  const ctaDescription = ctaContent?.description || "Join thousands of successful professionals who have transformed their careers with our training programs.";
  const ctaButtonText = ctaContent?.button_text || "Enroll Now";
  const ctaButtonLink = ctaContent?.button_link || "/courses";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      <Hero />
      <FeaturedCourses />
      
      {/* Enhanced Quick Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a community of achievers and be part of our success story
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{studentsCount}</h3>
              <p className="text-gray-600 font-medium text-sm">Students Trained</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">{coursesCount}</h3>
              <p className="text-gray-600 font-medium text-sm">Courses Available</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">{placementRate}</h3>
              <p className="text-gray-600 font-medium text-sm">Placement Rate</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-orange-600 mb-2">{experienceYears}</h3>
              <p className="text-gray-600 font-medium text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Enhanced Call to Action Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
              {ctaTitle}
            </h2>
            
            <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              {ctaDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-8 py-3 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(ctaButtonLink)}
              >
                {ctaButtonText}
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold px-8 py-3 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                Contact Us
                <Users className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold px-8 py-3 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate('/free-assessment')}
              >
                Take Assessment
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-blue-200 text-sm mb-3">Trusted by students from</p>
              <div className="flex justify-center items-center space-x-6 opacity-60">
                <span className="text-white font-semibold text-sm">Google</span>
                <span className="text-white">•</span>
                <span className="text-white font-semibold text-sm">Microsoft</span>
                <span className="text-white">•</span>
                <span className="text-white font-semibold text-sm">Amazon</span>
                <span className="text-white">•</span>
                <span className="text-white font-semibold text-sm">Meta</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
