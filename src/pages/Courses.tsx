import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
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

  // Fallback data if no courses in database
  const fallbackCourses = [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Full Stack Web Development",
      description: "Complete web development program covering frontend and backend technologies.",
      duration: "6 months",
      price: 15000,
      category: "Programming",
      level: "Beginner to Advanced",
      certification: "Industry Recognized Certificate",
      image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Data Science & Machine Learning",
      description: "Comprehensive data science program with hands-on ML projects.",
      duration: "8 months",
      price: 12000,
      category: "Data Science",
      level: "Intermediate",
      certification: "Data Science Professional Certificate",
      image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440003",
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile applications.",
      duration: "5 months",
      price: 14000,
      category: "Mobile Development",
      level: "Beginner",
      certification: "Mobile Developer Certificate",
      image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const displayCourses = courses && courses.length > 0 ? courses : fallbackCourses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Training Programs</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive courses designed to transform your career and master in-demand technologies.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {course.level || "All Levels"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                      ₹{course.price?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {course.duration || "Self-paced"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      250+ Students
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      4.8
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Course Highlights
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Industry-relevant curriculum
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Hands-on projects
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Expert instruction
                      </li>
                    </ul>
                  </div>

                  <div className="mb-6">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {course.certification || "Certificate Included"}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Not Sure Which Course to Choose?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take our free career assessment to find the perfect program for your goals.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/free-assessment')}
          >
            Take Free Assessment
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
