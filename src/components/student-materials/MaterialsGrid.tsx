
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Video, FileImage, File, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { useStudyProgress } from "@/hooks/useStudyProgress";

interface Material {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_url: string;
  file_size?: number;
  created_at: string;
  course_id: string;
  courses?: {
    id: string;
    title: string;
  };
}

interface MaterialsGridProps {
  materials: Material[];
  progressData: any[];
  onDownload: (material: Material) => void;
  onToggleCompletion: (materialId: string, courseId: string) => void;
  progressLoading: boolean;
}

export function MaterialsGrid({ 
  materials, 
  progressData, 
  onDownload, 
  onToggleCompletion, 
  progressLoading 
}: MaterialsGridProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return FileText;
    if (fileType?.includes('video')) return Video;
    if (fileType?.includes('image')) return FileImage;
    return File;
  };

  const getFileTypeColor = (fileType: string) => {
    if (fileType?.includes('pdf')) return 'bg-red-100 text-red-800';
    if (fileType?.includes('video')) return 'bg-blue-100 text-blue-800';
    if (fileType?.includes('image')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {materials.map((material) => {
        const FileIcon = getFileIcon(material.file_type);
        const progress = getMaterialProgress(material.id);
        const isCompleted = progress?.completed || false;
        
        return (
          <Card key={material.id} className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-6 text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative z-10 flex items-start justify-between">
                <FileIcon className="h-10 w-10 text-emerald-100" />
                <div className="flex items-center gap-2">
                  <Badge className={`${getFileTypeColor(material.file_type)} border-0`}>
                    {material.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                  </Badge>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-200" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <CardTitle className="text-xl text-white mb-2 line-clamp-2">{material.title}</CardTitle>
                <CardDescription className="text-emerald-100 line-clamp-2">
                  {material.description}
                </CardDescription>
              </div>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <BookOpen className="w-4 h-4 mr-3 text-emerald-500" />
                  <div>
                    <div className="font-medium text-gray-800">Course</div>
                    <div className="line-clamp-1">{material.courses?.title}</div>
                  </div>
                </div>
                {material.file_size && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <File className="w-4 h-4 mr-3 text-teal-500" />
                    <div>
                      <div className="font-medium text-gray-800">Size</div>
                      <div>{(material.file_size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <FileText className="w-4 h-4 mr-3 text-emerald-500" />
                  <div>
                    <div className="font-medium text-gray-800">Added</div>
                    <div>{new Date(material.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  onClick={() => onDownload(material)}
                  disabled={!material.file_url}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {material.file_url ? 'Download Material' : 'Not Available'}
                </Button>
                
                <Button
                  onClick={() => onToggleCompletion(material.id, material.course_id)}
                  disabled={progressLoading}
                  variant={isCompleted ? "default" : "outline"}
                  className={`w-full ${isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
