
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, CheckCircle2, Circle } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
}

interface MaterialContentAreaProps {
  selectedMaterial: Material | null;
  progressData: any[];
  progressLoading: boolean;
  onDownload: (material: Material) => void;
  onMaterialCompletion: (materialId: string) => void;
}

export function MaterialContentArea({
  selectedMaterial,
  progressData,
  progressLoading,
  onDownload,
  onMaterialCompletion
}: MaterialContentAreaProps) {
  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const isMarkdownFile = (material: Material) => {
    if (!material.file_url) return false;
    const url = material.file_url.toLowerCase();
    return url.endsWith('.md') || url.endsWith('.markdown') || material.mime_type?.includes('markdown');
  };

  if (!selectedMaterial) {
    return (
      <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent>
          <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Select a Material</h3>
          <p className="text-gray-600 text-lg">
            Choose a study material from the sidebar to begin learning
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isMarkdownFile(selectedMaterial)) {
    return (
      <div className="space-y-6">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">{selectedMaterial.title}</CardTitle>
            {selectedMaterial.description && (
              <p className="text-gray-600">{selectedMaterial.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Type:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  MARKDOWN
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getMaterialProgress(selectedMaterial.id)?.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
            
            <Button
              onClick={() => onMaterialCompletion(selectedMaterial.id)}
              disabled={progressLoading}
              variant={getMaterialProgress(selectedMaterial.id)?.completed ? "default" : "outline"}
              className={`w-full ${getMaterialProgress(selectedMaterial.id)?.completed ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            >
              {getMaterialProgress(selectedMaterial.id)?.completed ? (
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
          </CardContent>
        </Card>
        
        <MarkdownRenderer 
          filePath={selectedMaterial.file_url} 
          className="border-0 bg-white/80 backdrop-blur-sm shadow-xl"
        />
      </div>
    );
  }

  // Default material view for non-markdown files
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">{selectedMaterial.title}</CardTitle>
        {selectedMaterial.description && (
          <p className="text-gray-600">{selectedMaterial.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Type:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {selectedMaterial.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getMaterialProgress(selectedMaterial.id)?.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => onDownload(selectedMaterial)}
            disabled={!selectedMaterial.file_url}
          >
            <Download className="w-4 h-4 mr-2" />
            {selectedMaterial.file_url ? 'Open Material' : 'Not Available'}
          </Button>
          
          <Button
            onClick={() => onMaterialCompletion(selectedMaterial.id)}
            disabled={progressLoading}
            variant={getMaterialProgress(selectedMaterial.id)?.completed ? "default" : "outline"}
            className={`w-full ${getMaterialProgress(selectedMaterial.id)?.completed ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            {getMaterialProgress(selectedMaterial.id)?.completed ? (
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
}
