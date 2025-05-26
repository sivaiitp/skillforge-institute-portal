import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, Users, Download, CheckCircle } from 'lucide-react';

interface Course {
  price: number;
  category: string;
  level: string;
  duration: string;
  certification: string;
  brochure_url: string;
}

interface CourseSidebarProps {
  course: Course;
  onEnroll: () => void;
  onDownloadBrochure: () => void;
  isEnrolled?: boolean;
  enrollmentLoading?: boolean;
}

const CourseSidebar = ({ course, onEnroll, onDownloadBrochure, isEnrolled = false, enrollmentLoading = false }: CourseSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Enrollment Card */}
      <Card className="sticky top-6">
        <CardHeader>
          <div className="text-center">
            {isEnrolled ? (
              <div className="text-green-600 mb-2">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-xl font-bold">Enrolled</div>
                <p className="text-sm text-gray-600">You have access to this course</p>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{course.price?.toLocaleString('en-IN') || '0'}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className={`w-full ${
              isEnrolled 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            size="lg" 
            onClick={onEnroll}
            disabled={enrollmentLoading}
          >
            {enrollmentLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : isEnrolled ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Go to Course
              </>
            ) : (
              'Enroll Now'
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg" 
            onClick={onDownloadBrochure}
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
  );
};

export default CourseSidebar;
