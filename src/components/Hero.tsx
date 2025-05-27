
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Award, Play, CheckCircle } from "lucide-react";
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

  const features = [
    "Industry-Expert Instructors",
    "Hands-on Projects",
    "Job Placement Support",
    "Flexible Learning Schedule"
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Content - Takes more space */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Indicators */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Trusted by 500+ Students</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Career Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
            
            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <span className="text-gray-700 font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate(buttonLink)}
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-3 text-base font-semibold border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Mini Stats */}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200/60">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl mb-2">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">{coursesCount}</div>
                <div className="text-xs text-gray-600">Courses</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">{studentsCount}</div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl mb-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div className="text-xl font-bold text-gray-900">{placementRate}</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image - Takes less space */}
          <div className="lg:col-span-5 relative">
            {/* Main Image Container */}
            <div className="relative z-10 group max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Students learning"
                  className="rounded-xl w-full h-64 md:h-80 object-cover"
                />
                
                {/* Floating Card 1 */}
                <div className="absolute -top-3 -left-3 bg-white rounded-xl p-3 shadow-xl animate-bounce">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-gray-700">Live Session</span>
                  </div>
                </div>
                
                {/* Floating Card 2 */}
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-3 shadow-xl">
                  <div className="text-center">
                    <div className="text-lg font-bold">95%</div>
                    <div className="text-xs opacity-90">Job Success</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decorations - Smaller and positioned better */}
            <div className="absolute top-1/4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute bottom-1/4 -left-4 w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60 animate-pulse delay-75"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
