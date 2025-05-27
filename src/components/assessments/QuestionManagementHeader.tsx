
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink } from 'lucide-react';

interface QuestionManagementHeaderProps {
  assessmentTitle: string;
  onAddQuestion: () => void;
}

const QuestionManagementHeader = ({ assessmentTitle, onAddQuestion }: QuestionManagementHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{assessmentTitle}</h2>
            <ExternalLink className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600">Manage questions for this assessment</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onAddQuestion}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementHeader;
