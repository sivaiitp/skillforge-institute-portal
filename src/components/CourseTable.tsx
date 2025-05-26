
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, BookOpen, Eye, ExternalLink } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  is_active: boolean;
  image_url?: string;
  brochure_url?: string;
}

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CourseTable = ({ courses, onEdit, onDelete }: CourseTableProps) => {
  const handleEdit = (course: Course) => {
    console.log('Editing course:', course);
    onEdit(course);
  };

  const handleDelete = (courseId: string) => {
    console.log('Deleting course:', courseId);
    if (window.confirm('Are you sure you want to delete this course?')) {
      onDelete(courseId);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <BookOpen className="w-5 h-5 text-blue-600" />
          All Courses ({courses.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Course</TableHead>
                <TableHead className="font-semibold text-gray-700">Category</TableHead>
                <TableHead className="font-semibold text-gray-700">Level</TableHead>
                <TableHead className="font-semibold text-gray-700">Duration</TableHead>
                <TableHead className="font-semibold text-gray-700">Price</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.image_url ? (
                        <img 
                          src={course.image_url} 
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{course.title}</div>
                        {course.brochure_url && (
                          <a 
                            href={course.brochure_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Brochure
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      {course.category || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      {course.level || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600 font-medium">{course.duration || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-800">
                      {course.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={course.is_active ? 'default' : 'secondary'}
                      className={course.is_active 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                      }
                    >
                      {course.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(course)}
                        className="h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        className="h-8 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="font-medium">No courses found</p>
                        <p className="text-sm">Create your first course to get started</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTable;
