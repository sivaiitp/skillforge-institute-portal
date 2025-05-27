
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';

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
  uploadedFile,
  isUploading,
  formData,
  courses,
  onFileUpload,
  onResetFile,
  onFormDataChange
}: FileUploadSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      {!uploadedFile ? (
        <>
          <div>
            <Label htmlFor="file_upload" className="text-gray-700">Upload File</Label>
            <div className="mt-1">
              <Input
                id="file_upload"
                type="file"
                onChange={handleFileChange}
                accept=".md,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav"
                className="bg-white border-gray-300 text-gray-800"
                disabled={isUploading}
              />
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-gray-500">OR</span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">{uploadedFile.name}</span>
            <span className="text-xs text-gray-500">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFile}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!uploadedFile && (
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
      )}
    </div>
  );
};

export default FileUploadSection;
