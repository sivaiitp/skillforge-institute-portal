
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

const FileUploadSection = ({
  formData,
  onFormDataChange
}: FileUploadSectionProps) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
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
    </div>
  );
};

export default FileUploadSection;
