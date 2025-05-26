
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, File } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  category: string;
}

interface FileUploadSectionProps {
  uploadedFile: File | null;
  isUploading: boolean;
  formData: any;
  courses: Course[];
  onFileUpload: (file: File) => void;
  onResetFile: () => void;
  onFormDataChange: (data: any) => void;
}

const sanitizeForFilename = (text: string): string => {
  return text
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .substring(0, 50);
};

const getSelectedCourseName = (courses: Course[], courseId: string): string => {
  const selectedCourse = courses.find(course => course.id === courseId);
  return selectedCourse ? selectedCourse.title : 'unknown_course';
};

const FileUploadSection = ({
  uploadedFile,
  isUploading,
  formData,
  courses,
  onFileUpload,
  onResetFile,
  onFormDataChange
}: FileUploadSectionProps) => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!formData.course_id) {
      toast.error('Please select a course first before uploading a file');
      return;
    }

    try {
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        const content = await file.text();
        const courseName = sanitizeForFilename(getSelectedCourseName(courses, formData.course_id));
        const originalFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${courseName}_${originalFileName}`;
        const relativePath = `/content/${fileName}`;
        
        onFormDataChange({
          ...formData,
          file_url: relativePath,
          file_size: file.size,
          mime_type: 'text/markdown',
          file_extension: 'md',
          material_type: 'markdown'
        });
        
        localStorage.setItem(`markdown_content_${fileName}`, content);
        toast.success(`Markdown file uploaded successfully with course prefix! File will be saved as: ${fileName}`);
      } else {
        const fileUrl = URL.createObjectURL(file);
        onFormDataChange({
          ...formData,
          file_url: fileUrl,
          file_size: file.size,
          mime_type: file.type,
          file_extension: file.name.split('.').pop() || ''
        });
        
        toast.success('File uploaded successfully!');
      }
      
      onFileUpload(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <Label className="text-gray-700 font-medium">File Upload</Label>
        {uploadedFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFile}
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
                      Files will be prefixed with: {sanitizeForFilename(getSelectedCourseName(courses, formData.course_id))}_
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
                Will be saved as: {sanitizeForFilename(getSelectedCourseName(courses, formData.course_id))}_{uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}
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
    </div>
  );
};

export default FileUploadSection;
