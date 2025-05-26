
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MaterialTypeSelector from './MaterialTypeSelector';

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
  duration: string;
  mime_type: string;
  file_extension: string;
  sort_order: number;
  is_downloadable: boolean;
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
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" className="text-gray-700">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onFormDataChange({...formData, title: e.target.value})}
            required
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <Label htmlFor="course" className="text-gray-700">Course *</Label>
          <Select value={formData.course_id} onValueChange={onCourseChange}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-800 focus:border-emerald-500 focus:ring-emerald-500">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id} className="text-gray-800 hover:bg-gray-50">
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({...formData, description: e.target.value})}
          rows={3}
          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MaterialTypeSelector
          value={formData.material_type}
          onChange={(value) => onFormDataChange({...formData, material_type: value})}
        />
        <div>
          <Label htmlFor="sort_order" className="text-gray-700">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => onFormDataChange({...formData, sort_order: parseInt(e.target.value) || 0})}
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="duration" className="text-gray-700">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => onFormDataChange({...formData, duration: e.target.value})}
            placeholder="e.g., 45 minutes"
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <Label htmlFor="mime_type" className="text-gray-700">MIME Type</Label>
          <Input
            id="mime_type"
            value={formData.mime_type}
            onChange={(e) => onFormDataChange({...formData, mime_type: e.target.value})}
            placeholder="e.g., application/pdf"
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            readOnly={!!uploadedFile}
          />
        </div>
        <div>
          <Label htmlFor="file_extension" className="text-gray-700">File Extension</Label>
          <Input
            id="file_extension"
            value={formData.file_extension}
            onChange={(e) => onFormDataChange({...formData, file_extension: e.target.value})}
            placeholder="e.g., pdf"
            className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            readOnly={!!uploadedFile}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_downloadable"
            checked={formData.is_downloadable}
            onCheckedChange={(checked) => onFormDataChange({...formData, is_downloadable: checked})}
          />
          <Label htmlFor="is_downloadable" className="text-gray-700">Downloadable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => onFormDataChange({...formData, is_active: checked})}
          />
          <Label htmlFor="is_active" className="text-gray-700">Active</Label>
        </div>
      </div>
    </>
  );
};

export default StudyMaterialFormFields;
