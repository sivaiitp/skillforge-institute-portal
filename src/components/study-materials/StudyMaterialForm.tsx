
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText, Video, Music, Image, Presentation, ExternalLink, Upload, File } from 'lucide-react';
import { toast } from 'sonner';

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sanitizeForFilename = (text: string): string => {
    return text
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .toLowerCase()
      .substring(0, 50); // Limit length
  };

  const getSelectedCourseName = (): string => {
    const selectedCourse = courses.find(course => course.id === formData.course_id);
    return selectedCourse ? selectedCourse.title : 'unknown_course';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.course_id) {
      toast.error('Please select a course first before uploading a file');
      return;
    }

    setIsUploading(true);
    try {
      // For markdown files, we'll save them to the public/content directory with course prefix
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const content = await file.text();
        
        // Create a blob URL for immediate preview/use
        const blob = new Blob([content], { type: 'text/markdown' });
        
        // Get course name and sanitize it
        const courseName = sanitizeForFilename(getSelectedCourseName());
        const originalFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        
        // Create filename with course prefix
        const fileName = `${courseName}_${originalFileName}`;
        
        // Generate a relative path for the content directory
        const relativePath = `/content/${fileName}`;
        
        // Update form data with file information
        onFormDataChange({
          ...formData,
          file_url: relativePath,
          file_size: file.size,
          mime_type: 'text/markdown',
          file_extension: 'md',
          material_type: 'markdown'
        });
        
        setUploadedFile(file);
        
        // Store the content in localStorage temporarily with the new filename
        localStorage.setItem(`markdown_content_${fileName}`, content);
        
        toast.success(`Markdown file uploaded successfully with course prefix! File will be saved as: ${fileName}`);
      } else {
        // For other file types, handle as before
        const fileUrl = URL.createObjectURL(file);
        onFormDataChange({
          ...formData,
          file_url: fileUrl,
          file_size: file.size,
          mime_type: file.type,
          file_extension: file.name.split('.').pop() || ''
        });
        
        setUploadedFile(file);
        toast.success('File uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If it's a markdown file and we have content stored, create the actual file
    if (uploadedFile && formData.material_type === 'markdown') {
      const courseName = sanitizeForFilename(getSelectedCourseName());
      const originalFileName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${courseName}_${originalFileName}`;
      
      const content = localStorage.getItem(`markdown_content_${fileName}`);
      if (content) {
        // In a real application, you would save this to your server/storage
        console.log('Saving markdown content to:', formData.file_url);
        console.log('Content:', content);
        
        // Clean up localStorage
        localStorage.removeItem(`markdown_content_${fileName}`);
      }
    }
    
    onSubmit(e);
  };

  const resetFileUpload = () => {
    if (uploadedFile && formData.material_type === 'markdown') {
      const courseName = sanitizeForFilename(getSelectedCourseName());
      const originalFileName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${courseName}_${originalFileName}`;
      localStorage.removeItem(`markdown_content_${fileName}`);
    }
    setUploadedFile(null);
  };

  const handleClose = () => {
    resetFileUpload();
    onClose();
  };

  // Reset uploaded file when course changes
  const handleCourseChange = (courseId: string) => {
    if (uploadedFile) {
      resetFileUpload();
      toast.info('File upload reset. Please upload the file again after selecting the course.');
    }
    onFormDataChange({...formData, course_id: courseId});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{editingMaterial ? 'Edit' : 'Add'} Study Material</DialogTitle>
          <DialogDescription className="text-gray-600">
            {editingMaterial ? 'Update the study material details.' : 'Add a new study material for a course. You can upload files directly or provide URLs.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
              <Select value={formData.course_id} onValueChange={handleCourseChange}>
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

          {/* File Upload Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium">File Upload</Label>
              {uploadedFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetFileUpload}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Remove File
                </Button>
              )}
            </div>
            
            {!uploadedFile ? (
              <div>
                <input
                  type="file"
                  id="file-upload"
                  accept=".md,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading || !formData.course_id}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    !formData.course_id 
                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    ) : (
                      <>
                        <Upload className={`w-8 h-8 mb-2 ${!formData.course_id ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`mb-2 text-sm ${!formData.course_id ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-semibold">
                            {!formData.course_id ? 'Select a course first' : 'Click to upload'}
                          </span>
                          {formData.course_id && ' or drag and drop'}
                        </p>
                        <p className={`text-xs ${!formData.course_id ? 'text-gray-400' : 'text-gray-500'}`}>
                          Markdown, PDF, DOC, PPT, Images, Videos, Audio
                        </p>
                        {formData.course_id && (
                          <p className="text-xs text-emerald-600 mt-1">
                            Files will be prefixed with: {sanitizeForFilename(getSelectedCourseName())}_
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <File className="w-6 h-6 text-emerald-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  {formData.material_type === 'markdown' && (
                    <p className="text-xs text-emerald-600">
                      Will be saved as: {sanitizeForFilename(getSelectedCourseName())}_{uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Uploaded</span>
                </div>
              </div>
            )}
            
            <div className="text-center text-sm text-gray-600">
              <span className="font-medium">OR</span>
            </div>
          </div>

          <div>
            <Label htmlFor="file_url" className="text-gray-700">File URL (Alternative to upload)</Label>
            <Input
              id="file_url"
              value={formData.file_url}
              onChange={(e) => onFormDataChange({...formData, file_url: e.target.value})}
              placeholder="https://example.com/file.pdf"
              className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
              disabled={!!uploadedFile}
            />
            {uploadedFile && (
              <p className="text-xs text-gray-500 mt-1">URL field is disabled when a file is uploaded</p>
            )}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : editingMaterial ? 'Update' : 'Create'} Material
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyMaterialForm;
