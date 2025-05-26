
import React from 'react';
import { FileText, Video, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
  material_type: string;
}

interface MaterialContentRendererProps {
  material: Material;
  onDownload: (material: Material) => void;
}

export const MaterialContentRenderer = ({ material, onDownload }: MaterialContentRendererProps) => {
  const getFileIcon = (materialType: string, mimeType: string) => {
    if (materialType?.includes('video') || mimeType?.includes('video')) return Video;
    return FileText;
  };

  const isMarkdownFile = (material: Material) => {
    return material.material_type === 'markdown' || 
           material.mime_type === 'text/markdown' ||
           material.file_url?.endsWith('.md') ||
           material.file_url?.endsWith('.markdown');
  };

  const isVideoFile = (material: Material) => {
    return material.material_type === 'video' || 
           material.mime_type?.startsWith('video/');
  };

  const isPdfFile = (material: Material) => {
    return material.material_type === 'pdf' || 
           material.mime_type === 'application/pdf' ||
           material.file_url?.endsWith('.pdf');
  };

  if (!material.file_url) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No content available for this material.</p>
      </div>
    );
  }

  // Render markdown content directly
  if (isMarkdownFile(material)) {
    return (
      <div className="space-y-4">
        <MarkdownRenderer 
          filePath={material.file_url}
          className="border-0 shadow-none"
        />
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={() => onDownload(material)}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={() => window.open(material.file_url, '_blank')}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // Render video content
  if (isVideoFile(material)) {
    return (
      <div className="space-y-4">
        <video 
          controls 
          className="w-full rounded-lg shadow-sm"
          style={{ maxHeight: '500px' }}
        >
          <source src={material.file_url} type={material.mime_type} />
          Your browser does not support the video tag.
        </video>
        <div className="flex gap-2">
          <Button 
            onClick={() => onDownload(material)}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    );
  }

  // Render PDF content
  if (isPdfFile(material)) {
    return (
      <div className="space-y-4">
        <iframe
          src={material.file_url}
          className="w-full rounded-lg shadow-sm"
          style={{ height: '600px' }}
          title={material.title}
        />
        <div className="flex gap-2">
          <Button 
            onClick={() => onDownload(material)}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={() => window.open(material.file_url, '_blank')}
            variant="outline"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg space-y-4">
      <div className="mb-4">
        {React.createElement(getFileIcon(material.material_type, material.mime_type), {
          className: "w-12 h-12 text-gray-400 mx-auto"
        })}
      </div>
      <p className="text-gray-600 mb-4">
        {material.description || 'Content available for viewing'}
      </p>
      <div className="flex gap-2 justify-center">
        <Button 
          onClick={() => window.open(material.file_url, '_blank')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open File
        </Button>
        <Button 
          onClick={() => onDownload(material)}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};
