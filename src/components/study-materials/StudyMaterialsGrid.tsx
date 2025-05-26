
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, FileText, Video, Music, Image, Presentation, ExternalLink, BookOpen } from 'lucide-react';

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
  courses: {
    title: string;
    category: string;
  };
}

interface StudyMaterialsGridProps {
  materials: StudyMaterial[];
  onEdit: (material: StudyMaterial) => void;
  onDelete: (materialId: string) => void;
  onAddFirst: () => void;
  selectedCourse: string;
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

const StudyMaterialsGrid = ({ materials, onEdit, onDelete, onAddFirst, selectedCourse }: StudyMaterialsGridProps) => {
  const getMaterialIcon = (materialType: string) => {
    const type = materialTypes.find(t => t.value === materialType);
    return type ? type.icon : FileText;
  };

  const handleTitleClick = (material: StudyMaterial) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
    }
  };

  if (materials.length === 0) {
    return (
      <Card className="text-center py-12 bg-white shadow-sm border">
        <CardContent>
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2 text-gray-800">No Study Materials</h3>
          <p className="text-gray-600 mb-4">
            {selectedCourse === 'all' 
              ? "No study materials have been created yet."
              : "No study materials found for this course."
            }
          </p>
          <Button onClick={onAddFirst} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add First Material
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => {
        const IconComponent = getMaterialIcon(material.material_type);
        return (
          <Card key={material.id} className="bg-white shadow-sm border hover:shadow-md transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-emerald-500" />
                  <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-600 bg-emerald-50">
                    {material.material_type}
                  </Badge>
                  {!material.is_active && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(material)}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(material.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle 
                className="text-lg text-gray-800 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => handleTitleClick(material)}
              >
                {material.title}
              </CardTitle>
              <CardDescription>
                <span className="font-medium text-emerald-600">
                  {material.courses?.title}
                </span>
                {material.description && (
                  <span className="block mt-1 text-gray-600">{material.description}</span>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Order: {material.sort_order}</span>
                {material.duration && (
                  <span>Duration: {material.duration}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={material.is_downloadable ? 'text-green-600' : 'text-gray-500'}>
                  {material.is_downloadable ? 'Downloadable' : 'View Only'}
                </span>
                {material.file_url && (
                  <span className="text-emerald-600 text-xs">
                    Click title to open
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StudyMaterialsGrid;
