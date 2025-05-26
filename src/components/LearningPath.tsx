
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock, BookOpen, ClipboardCheck, Play } from 'lucide-react';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { toast } from 'sonner';

interface LearningPathProps {
  courseId: string;
  studyMaterials: any[];
  assessments: any[];
  onMaterialSelect: (material: any) => void;
  onAssessmentSelect: (assessment: any) => void;
}

const LearningPath = ({ 
  courseId, 
  studyMaterials, 
  assessments, 
  onMaterialSelect, 
  onAssessmentSelect 
}: LearningPathProps) => {
  const { getStudyProgress, getCourseProgress } = useStudyProgress();
  const [progressData, setProgressData] = useState([]);
  const [courseProgress, setCourseProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getStudyProgress(courseId);
      const courseProgressData = await getCourseProgress(courseId);
      setProgressData(progress);
      setCourseProgress(courseProgressData);
    };
    
    loadProgress();
  }, [courseId]);

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const isPrerequisiteMet = (currentIndex: number): boolean => {
    if (currentIndex === 0) return true;
    
    const previousMaterial = studyMaterials[currentIndex - 1];
    if (!previousMaterial) return true;
    
    const previousProgress = getMaterialProgress(previousMaterial.id);
    return previousProgress?.completed || false;
  };

  const shouldShowQuiz = (materialIndex: number): boolean => {
    // Show quiz after every 2-3 materials or at the end
    return (materialIndex + 1) % 3 === 0 || materialIndex === studyMaterials.length - 1;
  };

  const getQuizForMaterial = (materialIndex: number) => {
    const quizIndex = Math.floor(materialIndex / 3);
    return assessments[quizIndex];
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Materials Completed</span>
              <span>{courseProgress.completed}/{courseProgress.total} ({courseProgress.percentage}%)</span>
            </div>
            <Progress value={courseProgress.percentage} className="w-full h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-4">
        {studyMaterials.map((material, index) => {
          const progress = getMaterialProgress(material.id);
          const isCompleted = progress?.completed || false;
          const isAccessible = isPrerequisiteMet(index);
          const showQuiz = shouldShowQuiz(index);
          const quiz = getQuizForMaterial(index);

          return (
            <div key={material.id} className="space-y-2">
              {/* Study Material */}
              <Card className={`transition-all duration-200 ${
                isCompleted ? 'bg-green-50 border-green-200' : 
                isAccessible ? 'hover:shadow-md' : 'bg-gray-50 border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : isAccessible ? (
                        <Circle className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${
                          isAccessible ? 'text-gray-800' : 'text-gray-400'
                        }`}>
                          Chapter {index + 1}: {material.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {material.material_type}
                        </Badge>
                        {material.duration && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {material.duration}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        isAccessible ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {material.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => onMaterialSelect(material)}
                        disabled={!isAccessible}
                        variant={isCompleted ? "default" : "outline"}
                        size="sm"
                        className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {isCompleted ? "Review" : "Start"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz after specific chapters */}
              {showQuiz && quiz && isCompleted && (
                <Card className="ml-8 border-l-4 border-l-blue-500 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          Quiz: {quiz.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Test your knowledge from the previous chapters
                        </p>
                      </div>
                      <Button
                        onClick={() => onAssessmentSelect(quiz)}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Take Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
