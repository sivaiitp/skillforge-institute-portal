
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { MaterialContentRenderer } from './MaterialContentRenderer';

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
  material_type: string;
  sort_order: number;
}

interface MaterialContentAreaProps {
  selectedMaterial: Material | null;
  progressData: any[];
  progressLoading: boolean;
  onDownload: (material: Material) => void;
  onMaterialCompletion: (materialId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const MaterialContentArea = ({
  selectedMaterial,
  progressData,
  progressLoading,
  onDownload,
  onMaterialCompletion,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: MaterialContentAreaProps) => {
  
  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const isCompleted = selectedMaterial ? 
    getMaterialProgress(selectedMaterial.id)?.completed || false : false;

  if (!selectedMaterial) {
    return (
      <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent>
          <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Course Learning</h3>
          <p className="text-gray-600 mb-8 text-lg">
            Select a material from the sidebar to begin your studies.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            {selectedMaterial.title}
          </CardTitle>
          {selectedMaterial.description && (
            <p className="text-gray-600 mt-2">{selectedMaterial.description}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-8">
          <MaterialContentRenderer 
            material={selectedMaterial}
            onDownload={onDownload}
          />

          {/* Completion Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={() => onMaterialCompletion(selectedMaterial.id)}
              disabled={progressLoading}
              variant={isCompleted ? "default" : "outline"}
              className={`w-full ${isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              size="lg"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Mark as Incomplete
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              onClick={onPrevious}
              disabled={!hasPrevious}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              Navigation between materials
            </div>
            
            <Button
              onClick={onNext}
              disabled={!hasNext}
              variant="outline"
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
