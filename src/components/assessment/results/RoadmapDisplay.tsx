
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { UserPreferences } from "../AssessmentPreferences";
import { PersonalizedRoadmap } from "@/utils/roadmapGenerator";

interface RoadmapDisplayProps {
  preferences: UserPreferences;
  roadmap: PersonalizedRoadmap;
}

const RoadmapDisplay = ({ preferences, roadmap }: RoadmapDisplayProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Personalized Learning Roadmap</CardTitle>
        <CardDescription>Customized for {preferences.specialization} with {preferences.timeForInterview} commitment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {roadmap.phases.map((phase, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{phase.title}</h3>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Target size={16} />
                      Key Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapDisplay;
