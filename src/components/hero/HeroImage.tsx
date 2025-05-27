
import { Play, BookOpen, Users, Award, TrendingUp } from "lucide-react";

const HeroImage = () => {
  return (
    <div className="relative">
      {/* Main Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-3xl blur-3xl opacity-20"></div>
      
      {/* Main Container */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        
        {/* Header Section - Course Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="h-2 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                <div className="h-1.5 w-16 bg-gray-300 rounded-full mt-1"></div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Video Preview */}
          <div className="relative h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Play className="h-6 w-6 text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-white/80">Module 1: Introduction</div>
            <div className="absolute bottom-2 right-2 text-xs text-white/80">12:34</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Course Progress</span>
            <span className="text-sm font-bold text-blue-600">67%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold text-blue-600">500+</div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div className="text-lg font-bold text-purple-600">95%</div>
            <div className="text-xs text-gray-600">Success</div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-green-800 text-sm">Career Growth</div>
              <div className="text-xs text-green-600">Transform your career path</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-sm">🎯</span>
        </div>
        
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xs">✨</span>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
