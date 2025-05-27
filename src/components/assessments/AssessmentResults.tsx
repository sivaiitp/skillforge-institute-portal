
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentResultsProps {
  results: any[];
}

export const AssessmentResults = ({ results }: AssessmentResultsProps) => {
  const navigate = useNavigate();

  if (results.length === 0) return null;

  const handleViewHistory = (assessmentId: string) => {
    navigate(`/assessment-history/${assessmentId}`);
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Test Results & Performance</h3>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance History
          </CardTitle>
          <CardDescription>Your test results and progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{result.assessments?.title}</h4>
                  <p className="text-sm text-gray-600">
                    {result.assessments?.courses?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Taken on: {new Date(result.taken_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <div className="font-medium">
                      {result.score}/{result.total_marks}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((result.score / result.total_marks) * 100)}%
                    </div>
                    <Badge variant={result.passed ? "default" : "destructive"}>
                      {result.passed ? "Passed" : "Failed"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewHistory(result.assessment_id)}
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    View History
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
