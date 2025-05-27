
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { AssessmentResults as ResultsType } from "@/types/assessmentTypes";

interface AssessmentResultsProps {
  results: ResultsType;
}

const AssessmentResults = ({ results }: AssessmentResultsProps) => {
  const navigate = useNavigate();

  const getRecommendedCourse = (percentage: number) => {
    if (percentage >= 80) {
      return "Advanced Full Stack Development";
    } else if (percentage >= 60) {
      return "Full Stack Web Development";
    } else if (percentage >= 40) {
      return "Web Development Fundamentals";
    } else {
      return "Programming Basics";
    }
  };

  const recommendedCourse = getRecommendedCourse(results.percentage);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Assessment Results
        </h1>
        <p className="text-xl text-gray-600">Here's how you performed</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {results.percentage}%
              </div>
              <p className="text-gray-600 mb-4">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
              <Badge 
                variant={results.percentage >= 70 ? "default" : results.percentage >= 50 ? "secondary" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {results.percentage >= 70 ? "Excellent" : results.percentage >= 50 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Performance by topic area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.categoryScores).map(([category, scores]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm">{scores.correct}/{scores.total}</span>
                </div>
                <Progress value={(scores.correct / scores.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Based on your assessment results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Recommended Course:</h4>
              <p className="text-blue-800 text-lg font-medium">{recommendedCourse}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/courses')}
                className="flex-1"
              >
                Browse Courses
              </Button>
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline"
                className="flex-1"
              >
                Get Career Guidance
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="secondary"
                className="flex-1"
              >
                Create Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;
