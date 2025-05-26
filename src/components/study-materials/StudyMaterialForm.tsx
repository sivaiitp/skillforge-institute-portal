
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Video, Music, Image, Presentation, ExternalLink } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  category: string;
}

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  duration: string;
  is_downloadable: boolean;
  sort_order: number;
  is_active: boolean;
  course_id: string;
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

interface StudyMaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  courses: Course[];
  editingMaterial: StudyMaterial | null;
}

const materialTypes = [
  { value: 'pdf', label: 'PDF Document', icon: FileText },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'markdown', label: 'Markdown File', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'audio', label: 'Audio', icon: Music },
  { value: 'presentation', label: 'Presentation', icon: Presentation },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'link', label: 'External Link', icon: ExternalLink }
];

const StudyMaterialForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  courses,
  editingMaterial
}: StudyMaterialFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{editingMaterial ? 'Edit' : 'Add'} Study Material</DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingMaterial ? 'Update the study material details.' : 'Add a new study material for a course.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
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
              <Select value={formData.course_id} onValueChange={(value) => onFormDataChange({...formData, course_id: value})}>
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
            <div>
              <Label htmlFor="material_type" className="text-gray-700">Material Type</Label>
              <Select value={formData.material_type} onValueChange={(value) => onFormDataChange({...formData, material_type: value})}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-800 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {materialTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-gray-800 hover:bg-gray-50">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div>
            <Label htmlFor="file_url" className="text-gray-700">File URL</Label>
            <Input
              id="file_url"
              value={formData.file_url}
              onChange={(e) => onFormDataChange({...formData, file_url: e.target.value})}
              placeholder="https://example.com/file.pdf"
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              {editingMaterial ? 'Update' : 'Create'} Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyMaterialForm;
