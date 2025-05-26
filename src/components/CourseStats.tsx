
import React from 'react';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

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

interface CourseStatsProps {
  courses: Course[];
}

const CourseStats = ({ courses }: CourseStatsProps) => {
  const activeCourses = courses.filter(c => c.is_active).length;
  const featuredCourses = courses.filter(c => c.is_featured).length;
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-sm font-medium">Total Courses</p>
            <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
          </div>
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-sm font-medium">Active Courses</p>
            <p className="text-2xl font-bold text-gray-800">{activeCourses}</p>
          </div>
          <Users className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-700 text-sm font-medium">Featured Courses</p>
            <p className="text-2xl font-bold text-gray-800">{featuredCourses}</p>
          </div>
          <Award className="w-8 h-8 text-purple-500" />
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-700 text-sm font-medium">Total Value</p>
            <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};

export default CourseStats;
