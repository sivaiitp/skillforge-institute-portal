
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import CourseStats from './CourseStats';

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  brochure_url?: string;
}

interface CourseManagementHeaderProps {
  courses: Course[];
  loading: boolean;
  onAddCourse: () => void;
}

const CourseManagementHeader = ({ courses, loading, onAddCourse }: CourseManagementHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Course Management</h1>
              <p className="text-gray-600">Add, edit, and manage courses</p>
            </div>
          </div>
          <Button 
            onClick={onAddCourse} 
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Course
          </Button>
        </div>
        
        <CourseStats courses={courses} />
      </div>
    </div>
  );
};

export default CourseManagementHeader;
