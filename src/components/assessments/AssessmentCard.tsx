
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AssessmentCardProps {
  assessment: any;
  status: 'not_taken' | 'passed' | 'failed';
  score: string | null;
}

export const AssessmentCard = ({ assessment, status, score }: AssessmentCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{assessment.title}</CardTitle>
          <Badge 
            variant={
              status === 'passed' ? 'default' : 
              status === 'failed' ? 'destructive' : 'secondary'
            }
          >
            {status === 'not_taken' ? 'Available' : 
             status === 'passed' ? 'Passed' : 'Failed'}
          </Badge>
        </div>
        <CardDescription>{assessment.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Course:</span>
            <span className="font-medium">{assessment.courses?.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{assessment.duration_minutes} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Total Marks:</span>
            <span>{assessment.total_marks}</span>
          </div>
          <div className="flex justify-between">
            <span>Passing Marks:</span>
            <span>{assessment.passing_marks}</span>
          </div>
          {score && (
            <div className="flex justify-between">
              <span>Your Score:</span>
              <span className="font-medium">{score}</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full"
          disabled={status === 'passed'}
        >
          {status === 'passed' ? 'Completed' : 
           status === 'failed' ? 'Retake Test' : 'Start Test'}
        </Button>
      </CardContent>
    </Card>
  );
};
