
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Course {
  id: string;
  title: string;
}

interface AssessmentFormData {
  title: string;
  description: string;
  course_id: string;
  duration_minutes: string;
  total_marks: string;
  passing_marks: string;
  is_active: boolean;
}

interface AssessmentFormProps {
  formData: AssessmentFormData;
  courses: Course[];
  editingAssessment: any;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFormDataChange: (data: AssessmentFormData) => void;
}

const AssessmentForm = ({ 
  formData, 
  courses, 
  editingAssessment, 
  onSubmit, 
  onCancel, 
  onFormDataChange 
}: AssessmentFormProps) => {
  const handleInputChange = (field: keyof AssessmentFormData, value: string | boolean) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingAssessment ? 'Edit Assessment' : 'Add New Assessment'}
          </h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">Assessment Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="course_id" className="text-gray-700">Course</Label>
              <Select 
                value={formData.course_id} 
                onValueChange={(value) => handleInputChange('course_id', value)}
              >
                <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Select course (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id} className="text-gray-900 hover:bg-gray-100">
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration_minutes" className="text-gray-700">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                placeholder="60"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="total_marks" className="text-gray-700">Total Marks</Label>
              <Input
                id="total_marks"
                type="number"
                value={formData.total_marks}
                onChange={(e) => handleInputChange('total_marks', e.target.value)}
                placeholder="100"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="passing_marks" className="text-gray-700">Passing Marks</Label>
              <Input
                id="passing_marks"
                type="number"
                value={formData.passing_marks}
                onChange={(e) => handleInputChange('passing_marks', e.target.value)}
                placeholder="60"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;
