
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  score: number;
  total_marks: number;
  passed: boolean;
  time_spent: number;
  answers: Record<string, string>;
  completed_at: string;
  assessments: {
    title: string;
    description: string;
    passing_marks: number;
    courses: { title: string } | null;
  };
}

interface AssessmentResultSummaryProps {
  attempt: AssessmentAttempt;
  userRole: string;
}

const AssessmentResultSummary = ({ attempt, userRole }: AssessmentResultSummaryProps) => {
  const navigate = useNavigate();
  const percentage = (attempt.score / attempt.total_marks) * 100;

  const retakeAssessment = () => {
    navigate(`/take-assessment/${attempt?.assessment_id}`);
  };

  const viewHistory = () => {
    navigate(`/assessment-history/${attempt?.assessment_id}`);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          {attempt.passed ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {attempt.passed ? 'Congratulations!' : 'Keep Trying!'}
        </CardTitle>
        <p className="text-gray-600">{attempt.assessments.title}</p>
        {attempt.assessments.courses && (
          <Badge variant="outline">{attempt.assessments.courses.title}</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {attempt.score}/{attempt.total_marks}
            </div>
            <div className="text-xl text-gray-600 mb-4">
              {percentage.toFixed(1)}%
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-sm text-gray-500 mt-2">
              Passing score: {attempt.assessments.passing_marks}/{attempt.total_marks} 
              ({((attempt.assessments.passing_marks / attempt.total_marks) * 100).toFixed(1)}%)
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              onClick={viewHistory}
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              View History
            </Button>
            
            {!attempt.passed && (
              <Button onClick={retakeAssessment} className="bg-gradient-to-r from-blue-500 to-indigo-500">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentResultSummary;
