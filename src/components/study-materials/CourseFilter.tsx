
import React from 'react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  category: string;
}

interface CourseFilterProps {
  courses: Course[];
  selectedCourse: string;
  onCourseSelect: (courseId: string) => void;
}

const CourseFilter = ({ courses, selectedCourse, onCourseSelect }: CourseFilterProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCourse === 'all' ? 'default' : 'outline'}
          onClick={() => onCourseSelect('all')}
          size="sm"
          className={selectedCourse === 'all' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }
        >
          All Courses
        </Button>
        {courses.map((course) => (
          <Button
            key={course.id}
            variant={selectedCourse === course.id ? 'default' : 'outline'}
            onClick={() => onCourseSelect(course.id)}
            size="sm"
            className={selectedCourse === course.id 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }
          >
            {course.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CourseFilter;
