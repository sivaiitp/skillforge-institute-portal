
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
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-[85vh] flex items-center">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700">Trusted by 500+ Students</span>
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Career Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                {description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate(buttonLink)}
              >
                {buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate('/contact')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200/60 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{coursesCount}</div>
                <div className="text-sm text-gray-600">Courses</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{studentsCount}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{placementRate}</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative max-w-lg mx-auto lg:mx-0 lg:ml-auto">
              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Course Dashboard</h3>
                        <p className="text-sm text-gray-500">Your Learning Hub</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Web Development</span>
                        <span className="text-blue-600 font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Data Science</span>
                        <span className="text-purple-600 font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Digital Marketing</span>
                        <span className="text-green-600 font-medium">93%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '93%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Success Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-3 shadow-lg animate-bounce">
                <div className="text-center">
                  <Award className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-xs font-bold">95% Success</div>
                </div>
              </div>
              
              {/* Floating Students Count */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-gray-200 rounded-xl p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500">Active Students</div>
                  </div>
                </div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute top-1/4 -right-8 w-16 h-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-1/3 -left-8 w-12 h-12 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-60 animate-pulse delay-75"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
