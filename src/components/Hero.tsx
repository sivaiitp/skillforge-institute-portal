
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHomepageContent, useSiteSettings } from "@/hooks/useSiteSettings";

const Hero = () => {
  const navigate = useNavigate();
  const { data: homepageContent } = useHomepageContent();
  const { data: settings } = useSiteSettings();

  // Get hero content or fallback to defaults
  const heroContent = homepageContent?.find(item => item.section === 'hero');
  const statsContent = homepageContent?.filter(item => item.section.startsWith('stats_'));

  const title = heroContent?.title || "Transform Your Career with Professional Training";
  const description = heroContent?.description || "Join thousands of successful professionals who have advanced their careers through our comprehensive training programs in technology, data science, and digital marketing.";
  const buttonText = heroContent?.button_text || "Explore Courses";
  const buttonLink = heroContent?.button_link || "/courses";

  // Get stats data
  const coursesCount = statsContent?.find(item => item.section === 'stats_courses')?.title || "50+";
  const studentsCount = statsContent?.find(item => item.section === 'stats_students')?.title || "500+";
  const placementRate = statsContent?.find(item => item.section === 'stats_placement')?.title || "95%";

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {title.split('Professional Training')[0]}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Professional Training
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate(buttonLink)}
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
                onClick={() => navigate('/contact')}
              >
                Get Free Consultation
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{coursesCount}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{studentsCount}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{placementRate}</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
