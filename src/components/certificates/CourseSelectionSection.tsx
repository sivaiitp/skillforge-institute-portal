
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
}

interface CourseSelectionSectionProps {
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
  selectedStudent: any;
  availableCourses: Course[];
  enrolledCourses: any[];
  loadingEnrollments: boolean;
}

const CourseSelectionSection = ({
  selectedCourse,
  onCourseChange,
  selectedStudent,
  availableCourses,
  enrolledCourses,
  loadingEnrollments
}: CourseSelectionSectionProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Available Courses for Certification
      </Label>
      <Select 
        value={selectedCourse} 
        onValueChange={onCourseChange}
        disabled={!selectedStudent || availableCourses.length === 0 || loadingEnrollments}
      >
        <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors">
          <SelectValue placeholder={
            !selectedStudent 
              ? "Select a student first" 
              : loadingEnrollments
              ? "Loading enrollments..."
              : availableCourses.length === 0 
              ? "No courses available for certification" 
              : "Select a course to certify"
          } />
        </SelectTrigger>
        <SelectContent>
          {availableCourses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedStudent && !loadingEnrollments && enrolledCourses.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 font-medium">
            This student has no active enrollments.
          </p>
        </div>
      )}
      {selectedStudent && !loadingEnrollments && enrolledCourses.length > 0 && availableCourses.length === 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700 font-medium">
            This student already has certificates for all enrolled courses.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseSelectionSection;
