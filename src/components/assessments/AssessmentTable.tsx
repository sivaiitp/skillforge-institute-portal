
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Clock, FileText, Settings } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  courses?: { title: string };
  duration_minutes?: number;
  total_marks?: number;
  passing_marks?: number;
  is_active: boolean;
}

interface AssessmentTableProps {
  assessments: Assessment[];
  onEdit: (assessment: Assessment) => void;
  onDelete: (assessmentId: string) => void;
  onManageQuestions: (assessment: Assessment) => void;
}

const AssessmentTable = ({ assessments, onEdit, onDelete, onManageQuestions }: AssessmentTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          All Assessments ({assessments.length})
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 hover:bg-gray-50">
                <TableHead className="text-gray-700">Title</TableHead>
                <TableHead className="text-gray-700">Course</TableHead>
                <TableHead className="text-gray-700">Duration</TableHead>
                <TableHead className="text-gray-700">Marks</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{assessment.title}</TableCell>
                  <TableCell className="text-gray-600">
                    {assessment.courses?.title || 'General'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {assessment.duration_minutes || 'N/A'} min
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {assessment.passing_marks}/{assessment.total_marks}
                  </TableCell>
                  <TableCell>
                    <Badge variant={assessment.is_active ? 'default' : 'secondary'} 
                           className={assessment.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}>
                      {assessment.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onManageQuestions(assessment)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                        title="Manage Questions"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(assessment)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(assessment.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTable;
