
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AssessmentWelcomeProps {
  onStart: () => void;
}

const AssessmentWelcome = ({ onStart }: AssessmentWelcomeProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Free Skill Assessment
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover your current skill level and get personalized course recommendations
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>What to expect from this assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Number of Questions:</span>
            <Badge variant="secondary">15 Questions</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Time Limit:</span>
            <Badge variant="secondary">5 Minutes</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Topics Covered:</span>
            <Badge variant="secondary">Web Dev, Data Science, Cloud, DSA</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Difficulty Level:</span>
            <Badge variant="secondary">Beginner to Intermediate</Badge>
          </div>
        </CardContent>
      </Card>

      <Button 
        size="lg" 
        onClick={onStart}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Start Assessment
      </Button>
    </div>
  );
};

export default AssessmentWelcome;
