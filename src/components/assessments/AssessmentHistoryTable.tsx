
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Assessment History: {assessmentTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attempt</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((attempt) => {
                const percentage = (attempt.score / attempt.total_marks) * 100;
                return (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">
                      #{attempt.attempt_number}
                    </TableCell>
                    <TableCell>
                      {attempt.score}/{attempt.total_marks}
                    </TableCell>
                    <TableCell>
                      {percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={attempt.passed ? "default" : "destructive"}
                        className="flex items-center gap-1 w-fit"
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
                      {attempt.time_spent ? formatTime(attempt.time_spent) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(attempt.completed_at).toLocaleDateString()} at{' '}
                      {new Date(attempt.completed_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No assessment history found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistoryTable;
