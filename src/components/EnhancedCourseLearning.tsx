
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Video } from 'lucide-react';
import LearningPath from './LearningPath';
import MarkdownRenderer from './MarkdownRenderer';

interface EnhancedCourseLearningProps {
  course: any;
  studyMaterials: any[];
  assessments: any[];
  onBack: () => void;
}

const EnhancedCourseLearning = ({ 
  course, 
  studyMaterials, 
  assessments, 
  onBack 
}: EnhancedCourseLearningProps) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material);
    setSelectedAssessment(null);
  };

  const handleAssessmentSelect = (assessment: any) => {
    setSelectedAssessment(assessment);
    setSelectedMaterial(null);
  };

  const getFileIcon = (materialType: string) => {
    if (materialType?.includes('video')) return Video;
    return FileText;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Course Overview
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Learning Path Sidebar */}
        <div className="lg:col-span-1">
          <LearningPath
            courseId={course.id}
            studyMaterials={studyMaterials}
            assessments={assessments}
            onMaterialSelect={handleMaterialSelect}
            onAssessmentSelect={handleAssessmentSelect}
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          {selectedMaterial ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(getFileIcon(selectedMaterial.material_type), {
                      className: "w-5 h-5"
                    })}
                    {selectedMaterial.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{selectedMaterial.description}</p>
                  
                  {selectedMaterial.file_url && selectedMaterial.material_type === 'markdown' ? (
                    <MarkdownRenderer 
                      filePath={selectedMaterial.file_url}
                      className="border-0 shadow-none"
                    />
                  ) : selectedMaterial.file_url ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <div className="mb-4">
                        {React.createElement(getFileIcon(selectedMaterial.material_type), {
                          className: "w-12 h-12 text-gray-400 mx-auto"
                        })}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {selectedMaterial.material_type?.includes('video') ? 
                          'Video content available' : 
                          'Document available for viewing'
                        }
                      </p>
                      <Button 
                        onClick={() => window.open(selectedMaterial.file_url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {selectedMaterial.material_type?.includes('video') ? 
                          'Watch Video' : 
                          'Open Document'
                        }
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      No content available for this material.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : selectedAssessment ? (
            <Card>
              <CardHeader>
                <CardTitle>Assessment: {selectedAssessment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{selectedAssessment.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {selectedAssessment.duration_minutes} minutes
                    </div>
                    <div>
                      <span className="font-medium">Total Marks:</span> {selectedAssessment.total_marks}
                    </div>
                    <div>
                      <span className="font-medium">Passing Marks:</span> {selectedAssessment.passing_marks}
                    </div>
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Welcome to {course.title}</h3>
                <p className="text-gray-600">
                  Select a chapter from the learning path to begin your studies.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCourseLearning;
