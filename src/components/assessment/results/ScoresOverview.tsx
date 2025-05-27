
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target, Star } from "lucide-react";
import { AssessmentResults } from "@/types/assessmentTypes";
import { UserPreferences } from "../AssessmentPreferences";
import { PersonalizedRoadmap } from "@/utils/roadmapGenerator";

interface ScoresOverviewProps {
  results: AssessmentResults;
  preferences: UserPreferences;
  roadmap: PersonalizedRoadmap;
}

const ScoresOverview = ({ results, preferences, roadmap }: ScoresOverviewProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8 mb-8">
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
              {results.percentage >= 70 ? "Strong" : results.percentage >= 50 ? "Good" : "Needs Focus"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Plan</CardTitle>
          <CardDescription>Personalized timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={20} />
            <span className="font-medium">Timeline: {roadmap.timeline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="text-purple-600" size={20} />
            <span className="font-medium">Level: {roadmap.difficultyLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-orange-600" size={20} />
            <span className="font-medium">Focus: {preferences.specialization}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Performance by topic</CardDescription>
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
  );
};

export default ScoresOverview;
