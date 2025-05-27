
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface UserPreferences {
  specialization: string;
  experience: string;
  timeForInterview: string;
}

interface AssessmentPreferencesProps {
  onStart: (preferences: UserPreferences) => void;
}

const AssessmentPreferences = ({ onStart }: AssessmentPreferencesProps) => {
  const [specialization, setSpecialization] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [timeForInterview, setTimeForInterview] = useState<string>("");

  const handleSubmit = () => {
    if (specialization && experience && timeForInterview) {
      onStart({
        specialization,
        experience,
        timeForInterview
      });
    }
  };

  const isFormValid = specialization && experience && timeForInterview;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
        Personalized Skill Assessment
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Tell us about yourself to get a customized assessment and career roadmap
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assessment Preferences</CardTitle>
          <CardDescription>Help us customize your assessment experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-4 block">What's your area of interest?</Label>
            <RadioGroup value={specialization} onValueChange={setSpecialization}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Web Development" id="web-dev" />
                <Label htmlFor="web-dev">Web Development</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Data Science" id="data-science" />
                <Label htmlFor="data-science">Data Science</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cloud Computing" id="cloud" />
                <Label htmlFor="cloud">Cloud Computing</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">What's your experience level?</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">How much time can you dedicate for interview preparation?</Label>
            <Select value={timeForInterview} onValueChange={setTimeForInterview}>
              <SelectTrigger>
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 hours/week">1-2 hours per week</SelectItem>
                <SelectItem value="3-5 hours/week">3-5 hours per week</SelectItem>
                <SelectItem value="6-10 hours/week">6-10 hours per week</SelectItem>
                <SelectItem value="10+ hours/week">10+ hours per week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">What you'll get:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100">20 Questions</Badge>
            <span>Customized to your specialization</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100">Personalized</Badge>
            <span>Career roadmap</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100">Tailored</Badge>
            <span>Course recommendations</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-100">Downloadable</Badge>
            <span>Learning plan</span>
          </div>
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={handleSubmit}
        disabled={!isFormValid}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Start Personalized Assessment
      </Button>
    </div>
  );
};

export default AssessmentPreferences;
