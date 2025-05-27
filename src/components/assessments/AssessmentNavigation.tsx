
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface AssessmentNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const AssessmentNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}: AssessmentNavigationProps) => {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="px-6 py-3 text-lg font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Previous
      </Button>

      <div className="flex gap-3">
        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Assessment
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentNavigation;
