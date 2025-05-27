
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-gray-50">
                  <TableHead className="text-gray-700">Assessment</TableHead>
                  <TableHead className="text-gray-700">Course</TableHead>
                  <TableHead className="text-gray-700">Duration</TableHead>
                  <TableHead className="text-gray-700">Marks</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => {
                  const status = getAssessmentStatus(assessment.id);
                  const score = getAssessmentScore(assessment.id);
                  
                  return (
                    <TableRow key={assessment.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{assessment.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {assessment.description || "Complete this assessment to test your knowledge."}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {assessment.courses && (
                            <>
                              <Badge variant="outline" className="text-xs mb-1">
                                {assessment.courses.category}
                              </Badge>
                              <div className="text-sm text-gray-600">{assessment.courses.title}</div>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{assessment.duration_minutes} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Passing: {assessment.passing_marks}/{assessment.total_marks}</div>
                          {score && (
                            <div className="text-gray-600 mt-1">Your Score: {score}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {status === 'passed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                          {status === 'not_taken' && <Play className="w-4 h-4 text-blue-500" />}
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
                        </div>
                      </TableCell>
                      <TableCell>
                        {status === 'not_taken' && (
                          <Button 
                            onClick={() => handleTakeAssessment(assessment.id)}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Take Assessment
                          </Button>
                        )}
                        
                        {status === 'failed' && (
                          <Button 
                            onClick={() => handleTakeAssessment(assessment.id)}
                            variant="outline"
                            size="sm"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retake
                          </Button>
                        )}
                        
                        {status === 'passed' && (
                          <Button 
                            disabled
                            size="sm"
                            className="bg-green-100 text-green-800 cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};
