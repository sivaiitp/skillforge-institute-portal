import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Video, CheckCircle2, Circle } from 'lucide-react';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { useCourseLearningNavigation } from '@/hooks/useCourseLearningNavigation';
import LearningPath from './LearningPath';
import MarkdownRenderer from './MarkdownRenderer';
import CourseLearningNavigation from './CourseLearningNavigation';

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
  const { getStudyProgress, toggleMaterialCompletion, loading: progressLoading } = useStudyProgress();
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getStudyProgress(course.id);
      setProgressData(progress);
    };
    
    loadProgress();
  }, [course.id]);

  const {
    currentMaterialIndex,
    selectedMaterial,
    selectedAssessment,
    isCurrentMaterialCompleted,
    hasNextMaterial,
    hasPreviousMaterial,
    goToNext,
    goToPrevious,
    handleMaterialSelect,
    handleAssessmentSelect
  } = useCourseLearningNavigation({
    studyMaterials,
    assessments,
    progressData,
    onMaterialSelect: () => {},
    onAssessmentSelect: () => {}
  });

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const handleMaterialCompletion = async () => {
    if (!selectedMaterial) return;
    
    const currentProgress = getMaterialProgress(selectedMaterial.id);
    const currentStatus = currentProgress?.completed || false;
    
    const success = await toggleMaterialCompletion(selectedMaterial.id, course.id, currentStatus);
    if (success) {
      // Refresh progress data
      const updatedProgress = await getStudyProgress(course.id);
      setProgressData(updatedProgress);
    }
  };

  const getFileIcon = (materialType: string) => {
    if (materialType?.includes('video')) return Video;
    return FileText;
  };

  const completedCount = progressData.filter(p => p.completed).length;

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

                  {/* Completion Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button
                      onClick={handleMaterialCompletion}
                      disabled={progressLoading}
                      variant={isCurrentMaterialCompleted() ? "default" : "outline"}
                      className={`w-full ${isCurrentMaterialCompleted() ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    >
                      {isCurrentMaterialCompleted() ? (
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

                  {/* Navigation */}
                  <CourseLearningNavigation
                    hasNext={hasNextMaterial()}
                    hasPrevious={hasPreviousMaterial()}
                    isCompleted={isCurrentMaterialCompleted()}
                    onNext={goToNext}
                    onPrevious={goToPrevious}
                    currentIndex={currentMaterialIndex}
                    totalMaterials={studyMaterials.length}
                    completedCount={completedCount}
                  />
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
