
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Course {
  id: string;
  title: string;
  category: string;
}

interface FormData {
  title: string;
  description: string;
  course_id: string;
  material_type: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  duration: string;
  is_downloadable: boolean;
  sort_order: number;
  is_active: boolean;
}

interface StudyMaterialFormFieldsProps {
  formData: FormData;
  courses: Course[];
  uploadedFile: File | null;
  onFormDataChange: (data: FormData) => void;
  onCourseChange: (courseId: string) => void;
}

const StudyMaterialFormFields = ({
  formData,
  courses,
  uploadedFile,
  onFormDataChange,
  onCourseChange
}: StudyMaterialFormFieldsProps) => {
  const handleInputChange = (field: keyof FormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Material title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="course">Course *</Label>
          <Select 
            value={formData.course_id} 
            onValueChange={onCourseChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Material description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="material_type">Material Type</Label>
          <Select 
            value={formData.material_type} 
            onValueChange={(value) => handleInputChange('material_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="markdown">Markdown Document</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 30 minutes, 2 hours"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_downloadable"
              checked={formData.is_downloadable}
              onCheckedChange={(checked) => handleInputChange('is_downloadable', checked)}
            />
            <Label htmlFor="is_downloadable">Downloadable</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialFormFields;
