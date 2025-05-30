
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen, Download } from 'lucide-react';

interface Course {
  title: string;
  description: string;
  level: string;
  duration: string;
  category: string;
  price: number;
  image_url: string;
  brochure_url: string;
}

interface CourseHeroProps {
  course: Course;
  onDownloadBrochure: () => void;
  isEnrolled?: boolean;
  onEnroll: () => void;
  onGoToCourse: () => void;
  loading: boolean;
}

const CourseHero = ({ 
  course, 
  onDownloadBrochure, 
  isEnrolled, 
  onEnroll, 
  onGoToCourse, 
  loading 
}: CourseHeroProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('${course.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}')`
        }}
      ></div>
      <div className="w-full max-w-[85%] mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {course.level} Level
              </Badge>
            </div>
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
              {isEnrolled ? (
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={onGoToCourse}
                >
                  Go to Course
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={onEnroll}
                  disabled={loading}
                >
                  {loading ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white bg-transparent hover:bg-white hover:text-blue-600"
                onClick={onDownloadBrochure}
                disabled={!course.brochure_url}
              >
                <Download className="w-4 h-4 mr-2" />
                {course.brochure_url ? 'Download Brochure' : 'Brochure Not Available'}
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
  );
};

export default CourseHero;
