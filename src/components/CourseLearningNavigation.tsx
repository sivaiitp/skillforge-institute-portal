
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface CourseLearningNavigationProps {
  hasNext: boolean;
  hasPrevious: boolean;
  isCompleted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalMaterials: number;
}

const CourseLearningNavigation = ({
  hasNext,
  hasPrevious,
  isCompleted,
  onNext,
  onPrevious,
  currentIndex,
  totalMaterials
}: CourseLearningNavigationProps) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Chapter {currentIndex + 1} of {totalMaterials}
        </span>
        {isCompleted && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={!hasNext || !isCompleted}
        className={`flex items-center gap-2 ${
          isCompleted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CourseLearningNavigation;
