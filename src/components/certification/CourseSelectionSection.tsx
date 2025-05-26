
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, AlertCircle } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  enrollment_date: string;
  has_certificate: boolean;
}

interface CourseSelectionSectionProps {
  enrolledCourses: EnrolledCourse[];
  loadingEnrollments: boolean;
  selectedCourse: string;
  setSelectedCourse: (courseId: string) => void;
}

const CourseSelectionSection = ({
  enrolledCourses,
  loadingEnrollments,
  selectedCourse,
  setSelectedCourse,
}: CourseSelectionSectionProps) => {
  const availableCourses = enrolledCourses.filter(course => !course.has_certificate);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Select Enrolled Course (No Certificate Yet)
      </Label>
      
      {loadingEnrollments ? (
        <div className="flex items-center justify-center h-11 border border-gray-200 rounded-md bg-gray-50">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-500">Loading enrollments...</span>
        </div>
      ) : availableCourses.length === 0 ? (
        <div className="flex items-center gap-2 p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-700">
            {enrolledCourses.length === 0 
              ? "This student is not enrolled in any courses" 
              : "This student already has certificates for all enrolled courses"
            }
          </span>
        </div>
      ) : (
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <SelectValue placeholder="Choose a course to certify" />
          </SelectTrigger>
          <SelectContent>
            {availableCourses.map((course) => (
              <SelectItem key={course.id} value={course.id} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{course.title}</span>
                    <p className="text-xs text-gray-500">
                      Enrolled: {new Date(course.enrollment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default CourseSelectionSection;
