
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { AssessmentCard } from "./AssessmentCard";

interface AvailableAssessmentsProps {
  assessments: any[];
  getAssessmentStatus: (assessmentId: string) => 'not_taken' | 'passed' | 'failed';
  getAssessmentScore: (assessmentId: string) => string | null;
}

export const AvailableAssessments = ({ 
  assessments, 
  getAssessmentStatus, 
  getAssessmentScore 
}: AvailableAssessmentsProps) => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Available Tests</h3>
      {assessments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tests Available</h3>
            <p className="text-gray-600">There are no active assessments at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => {
            const status = getAssessmentStatus(assessment.id);
            const score = getAssessmentScore(assessment.id);
            
            return (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                status={status}
                score={score}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
