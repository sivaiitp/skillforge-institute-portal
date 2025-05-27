
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle, GraduationCap } from 'lucide-react';

interface AssessmentManagementHeaderProps {
  assessmentsCount: number;
  activeAssessmentsCount: number;
  coursesCount: number;
  onAddAssessment: () => void;
}

const AssessmentManagementHeader = ({ 
  assessmentsCount, 
  activeAssessmentsCount, 
  coursesCount, 
  onAddAssessment 
}: AssessmentManagementHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Assessment Management</h1>
              <p className="text-gray-600">Create and manage online assessments</p>
            </div>
          </div>
          <Button 
            onClick={onAddAssessment} 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Assessment
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-800">{assessmentsCount}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium">Active Assessments</p>
                <p className="text-2xl font-bold text-gray-800">{activeAssessmentsCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Linked Courses</p>
                <p className="text-2xl font-bold text-gray-800">{coursesCount}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentManagementHeader;
