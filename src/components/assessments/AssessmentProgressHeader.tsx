
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AssessmentTimer from './AssessmentTimer';

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
}

interface AssessmentProgressHeaderProps {
  assessment: Assessment;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  answeredCount: number;
}

const AssessmentProgressHeader = ({
  assessment,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  answeredCount
}: AssessmentProgressHeaderProps) => {
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{assessment.title}</h2>
            <p className="text-gray-600 mt-1">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <AssessmentTimer timeRemaining={timeRemaining} />
            <Badge variant="outline" className="text-sm px-3 py-1">
              {answeredCount}/{totalQuestions} answered
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentProgressHeader;
