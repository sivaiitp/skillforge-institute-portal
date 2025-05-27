
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
    <section className="relative pt-6 pb-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-[80vh] flex items-center">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Career Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-7 py-2.5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate(buttonLink)}
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-7 py-2.5 text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-2 pt-4 max-w-lg">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/60 max-w-md">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{coursesCount}</div>
                <div className="text-xs text-gray-600">Courses</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{studentsCount}</div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{placementRate}</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>

            {/* Trusted By Badge - moved to bottom with more space */}
            <div className="pt-3">
              <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Trusted by 500+ Students</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-lg mx-auto lg:mx-0">
              {/* Main Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Professional woman learning online"
                  className="w-full h-[400px] object-cover"
                />
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
                
                {/* Floating Success Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-3 shadow-lg">
                  <div className="text-center">
                    <Award className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-bold">95% Success</div>
                  </div>
                </div>
                
                {/* Course Progress Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Learning Progress</h4>
                          <p className="text-xs text-gray-500">Web Development</p>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-blue-600">85%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Students Count */}
              <div className="absolute -bottom-3 -left-3 bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500">Active Students</div>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-1/3 -right-6 w-8 h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-60 animate-pulse delay-75"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
