
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Book } from "lucide-react";
import { AssessmentResults } from "@/types/assessmentTypes";
import { UserPreferences } from "../AssessmentPreferences";
import { PersonalizedRoadmap } from "@/utils/roadmapGenerator";
import { generatePDFContent } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

interface CourseRecommendationsProps {
  results: AssessmentResults;
  preferences: UserPreferences;
  roadmap: PersonalizedRoadmap;
  recommendedCourses: string[];
}

const CourseRecommendations = ({ 
  results, 
  preferences, 
  roadmap, 
  recommendedCourses 
}: CourseRecommendationsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const downloadRoadmapAsPDF = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow popups to download the PDF",
        variant: "destructive"
      });
      return;
    }

    const htmlContent = generatePDFContent(results, preferences, roadmap, recommendedCourses);
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast({
      title: "PDF Generation Started",
      description: "Your personalized roadmap PDF is being prepared for download.",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Recommended Courses</CardTitle>
        <CardDescription>Based on your assessment results and goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {recommendedCourses.map((course, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Book className="text-blue-600" size={20} />
                <span className="font-medium">{course}</span>
              </div>
              <Badge 
                variant={index === 0 ? "default" : "secondary"}
                className={index === 0 ? "bg-green-600" : ""}
              >
                {index === 0 ? "Recommended" : "Next Steps"}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={downloadRoadmapAsPDF}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2" size={16} />
            Download PDF Roadmap
          </Button>
          <Button 
            onClick={() => navigate('/courses')}
            variant="outline"
            className="flex-1"
          >
            <Book className="mr-2" size={16} />
            Browse Courses
          </Button>
          <Button 
            onClick={() => navigate('/contact')}
            variant="secondary"
            className="flex-1"
          >
            Get Career Guidance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRecommendations;
