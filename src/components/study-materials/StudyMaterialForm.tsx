
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import StudyMaterialFormFields from './StudyMaterialFormFields';
import FileUploadSection from './FileUploadSection';

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
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .substring(0, 50);
  };

  const getSelectedCourseName = (): string => {
    const selectedCourse = courses.find(course => course.id === formData.course_id);
    return selectedCourse ? selectedCourse.title : 'unknown_course';
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      setUploadedFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFile && formData.material_type === 'markdown') {
      const courseName = sanitizeForFilename(getSelectedCourseName());
      const originalFileName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${courseName}_${originalFileName}`;
      
      const content = localStorage.getItem(`markdown_content_${fileName}`);
      if (content) {
        console.log('Saving markdown content to:', formData.file_url);
        console.log('Content:', content);
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
          <StudyMaterialFormFields
            formData={formData}
            courses={courses}
            uploadedFile={uploadedFile}
            onFormDataChange={onFormDataChange}
            onCourseChange={handleCourseChange}
          />

          <FileUploadSection
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            formData={formData}
            courses={courses}
            onFileUpload={handleFileUpload}
            onResetFile={resetFileUpload}
            onFormDataChange={onFormDataChange}
          />

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
