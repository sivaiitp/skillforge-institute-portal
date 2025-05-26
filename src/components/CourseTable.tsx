
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  is_active: boolean;
}

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CourseTable = ({ courses, onEdit, onDelete }: CourseTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          All Courses ({courses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{course.category || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{course.level || 'N/A'}</Badge>
                </TableCell>
                <TableCell>{course.duration || 'N/A'}</TableCell>
                <TableCell>
                  {course.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
                </TableCell>
                <TableCell>
                  <Badge variant={course.is_active ? 'default' : 'secondary'}>
                    {course.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(course)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(course.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseTable;
