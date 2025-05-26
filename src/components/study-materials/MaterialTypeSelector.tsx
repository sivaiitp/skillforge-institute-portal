
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Video, Music, Image, Presentation, ExternalLink } from 'lucide-react';

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

interface MaterialTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const MaterialTypeSelector = ({ value, onChange }: MaterialTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="material_type" className="text-gray-700">Material Type</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
};

export default MaterialTypeSelector;
