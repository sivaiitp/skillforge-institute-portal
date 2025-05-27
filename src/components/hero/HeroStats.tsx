
import { TrendingUp, Users, Award } from "lucide-react";

interface HeroStatsProps {
  coursesCount: string;
  studentsCount: string;
  placementRate: string;
}

const HeroStats = ({ coursesCount, studentsCount, placementRate }: HeroStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mb-2">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{studentsCount}</div>
        <div className="text-sm text-gray-600 font-medium">Students</div>
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mb-2">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{coursesCount}</div>
        <div className="text-sm text-gray-600 font-medium">Courses</div>
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl mb-2">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{placementRate}</div>
        <div className="text-sm text-gray-600 font-medium">Placement</div>
      </div>
    </div>
  );
};

export default HeroStats;
