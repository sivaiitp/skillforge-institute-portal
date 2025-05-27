
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Calendar, Target } from 'lucide-react';

interface AssessmentHistoryItem {
  id: string;
  attempt_number: number;
  score: number;
  total_marks: number;
  passed: boolean;
  time_spent: number;
  completed_at: string;
}

interface AssessmentHistoryTableProps {
  history: AssessmentHistoryItem[];
  assessmentTitle: string;
}

const AssessmentHistoryTable = ({ history, assessmentTitle }: AssessmentHistoryTableProps) => {
  const formatTime = (seconds: number) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime12Hour = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getScoreColor = (percentage: number, passed: boolean) => {
    if (passed) return 'text-green-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-white/20">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Attempt History
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Detailed history of all attempts for "{assessmentTitle}"
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No History Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't completed this assessment yet. Take your first attempt to start building your history!
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-700 py-4">Attempt</TableHead>
                  <TableHead className="font-semibold text-gray-700">Score</TableHead>
                  <TableHead className="font-semibold text-gray-700">Percentage</TableHead>
                  <TableHead className="font-semibold text-gray-700">Result</TableHead>
                  <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((attempt, index) => {
                  const percentage = (attempt.score / attempt.total_marks) * 100;
                  const isLatest = index === 0;
                  
                  return (
                    <TableRow 
                      key={attempt.id} 
                      className={`hover:bg-blue-50/50 transition-colors ${
                        isLatest ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isLatest ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            #{attempt.attempt_number}
                          </div>
                          {isLatest && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          {attempt.score}<span className="text-gray-500">/{attempt.total_marks}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-bold text-lg ${getScoreColor(percentage, attempt.passed)}`}>
                          {percentage.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={attempt.passed ? "default" : "destructive"}
                          className={`flex items-center gap-2 w-fit font-medium ${
                            attempt.passed 
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {attempt.passed ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {attempt.passed ? "Passed" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatTime(attempt.time_spent)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatDate(attempt.completed_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 font-medium">
                          {formatTime12Hour(attempt.completed_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistoryTable;
