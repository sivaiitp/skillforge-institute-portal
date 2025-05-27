
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Files, FileText, Download, BookOpen } from 'lucide-react';

interface StudyMaterialsHeaderProps {
  materialsCount: number;
  activeCount: number;
  downloadableCount: number;
  coursesCount: number;
  onAddMaterial: () => void;
}

const StudyMaterialsHeader = ({
  materialsCount,
  activeCount,
  downloadableCount,
  coursesCount,
  onAddMaterial
}: StudyMaterialsHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <Files className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Study Materials Management</h1>
              <p className="text-gray-600">Manage course materials, upload files, and organize learning content</p>
            </div>
          </div>
          <Button 
            onClick={onAddMaterial}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Study Material
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">Total Materials</p>
                <p className="text-2xl font-bold text-gray-800">{materialsCount}</p>
              </div>
              <Files className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Active Materials</p>
                <p className="text-2xl font-bold text-gray-800">{activeCount}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium">Downloadable</p>
                <p className="text-2xl font-bold text-gray-800">{downloadableCount}</p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium">Linked Courses</p>
                <p className="text-2xl font-bold text-gray-800">{coursesCount}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialsHeader;
