
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <Hero />
      <FeaturedCourses />
      <Testimonials />
      
      {/* Quick Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-blue-600">{studentsCount}</h3>
              <p className="text-gray-600">Students Trained</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-blue-600">{coursesCount}</h3>
              <p className="text-gray-600">Courses Available</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-blue-600">{placementRate}</h3>
              <p className="text-gray-600">Placement Rate</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-3xl font-bold text-blue-600">{experienceYears}</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{ctaTitle}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(ctaButtonLink)}
            >
              {ctaButtonText}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600"
              onClick={() => navigate('/free-assessment')}
            >
              Take Assessment
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
