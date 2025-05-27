
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  courses: { title: string; category: string } | null;
}

interface AvailableAssessmentsProps {
  assessments: Assessment[];
  getAssessmentStatus: (assessmentId: string) => string;
  getAssessmentScore: (assessmentId: string) => string | null;
}

export const AvailableAssessments = ({ 
  assessments, 
  getAssessmentStatus, 
  getAssessmentScore 
}: AvailableAssessmentsProps) => {
  const navigate = useNavigate();

  const handleTakeAssessment = (assessmentId: string) => {
    navigate(`/take-assessment/${assessmentId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Assessments</h2>
      
      {assessments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="p-8">
              <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">No Assessments Available</h3>
              <p className="text-gray-600">
                There are currently no assessments available. Check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => {
            const status = getAssessmentStatus(assessment.id);
            const score = getAssessmentScore(assessment.id);
            
            return (
              <Card key={assessment.id} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {status === 'passed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                      {status === 'not_taken' && <Play className="w-5 h-5 text-blue-500" />}
                    </div>
                  </div>
                  
                  {assessment.courses && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {assessment.courses.category}
                      </Badge>
                      <span className="text-sm text-gray-600">{assessment.courses.title}</span>
                    </div>
                  )}
                  
                  <CardDescription className="text-sm">
                    {assessment.description || "Complete this assessment to test your knowledge."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Assessment Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{assessment.duration_minutes} min</span>
                      </div>
                      <div>
                        <span className="font-medium">Passing: {assessment.passing_marks}/{assessment.total_marks}</span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={
                          status === 'passed' ? 'default' : 
                          status === 'failed' ? 'destructive' : 
                          'secondary'
                        }
                        className={
                          status === 'passed' ? 'bg-green-100 text-green-800 border-green-200' :
                          status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-blue-100 text-blue-800 border-blue-200'
                        }
                      >
                        {status === 'passed' && 'Passed'}
                        {status === 'failed' && 'Failed'}
                        {status === 'not_taken' && 'Not Taken'}
                      </Badge>
                      
                      {score && (
                        <span className="text-sm font-medium text-gray-600">
                          Score: {score}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      {status === 'not_taken' && (
                        <Button 
                          onClick={() => handleTakeAssessment(assessment.id)}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Take Assessment
                        </Button>
                      )}
                      
                      {status === 'failed' && (
                        <Button 
                          onClick={() => handleTakeAssessment(assessment.id)}
                          variant="outline"
                          className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Retake Assessment
                        </Button>
                      )}
                      
                      {status === 'passed' && (
                        <Button 
                          disabled
                          className="w-full bg-green-100 text-green-800 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
