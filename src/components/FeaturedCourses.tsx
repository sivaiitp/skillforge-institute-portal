
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedCourses = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Training Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading courses...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Training Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular courses designed by industry experts to help you 
            master in-demand skills and advance your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <Card key={course.id} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {course.level}
                  </Badge>
                  <span className="text-2xl font-bold text-blue-600">₹{course.price?.toLocaleString()}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.certification}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    Available
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    4.8
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            View All Courses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
