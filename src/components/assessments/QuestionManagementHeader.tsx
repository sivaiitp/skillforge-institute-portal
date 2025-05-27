
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface QuestionManagementHeaderProps {
  assessmentTitle: string;
  onAddQuestion: () => void;
}

const QuestionManagementHeader = ({ assessmentTitle, onAddQuestion }: QuestionManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Questions for: {assessmentTitle}</h2>
        <p className="text-gray-600">Manage questions for this assessment</p>
      </div>
      <Button 
        onClick={onAddQuestion}
        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
};

export default QuestionManagementHeader;
