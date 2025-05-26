
import { useState, useEffect } from 'react';

interface UseCourseLearningNavigationProps {
  studyMaterials: any[];
  assessments: any[];
  progressData: any[];
  onMaterialSelect: (material: any) => void;
  onAssessmentSelect: (assessment: any) => void;
}

export const useCourseLearningNavigation = ({
  studyMaterials,
  assessments,
  progressData,
  onMaterialSelect,
  onAssessmentSelect
}: UseCourseLearningNavigationProps) => {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState<number>(-1);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const isCurrentMaterialCompleted = () => {
    if (!selectedMaterial) return false;
    const progress = getMaterialProgress(selectedMaterial.id);
    return progress?.completed || false;
  };

  const hasNextMaterial = () => {
    return currentMaterialIndex < studyMaterials.length - 1;
  };

  const hasPreviousMaterial = () => {
    return currentMaterialIndex > 0;
  };

  const getLastAccessedMaterial = () => {
    // Find the last incomplete material
    for (let i = 0; i < studyMaterials.length; i++) {
      const material = studyMaterials[i];
      const progress = getMaterialProgress(material.id);
      if (!progress?.completed) {
        return { material, index: i };
      }
    }
    
    // If all materials are completed, return the last one
    if (studyMaterials.length > 0) {
      return { 
        material: studyMaterials[studyMaterials.length - 1], 
        index: studyMaterials.length - 1 
      };
    }
    
    return null;
  };

  // Auto-select material on initialization
  useEffect(() => {
    if (!isInitialized && studyMaterials.length > 0 && progressData !== undefined) {
      const lastAccessed = getLastAccessedMaterial();
      
      if (lastAccessed) {
        setCurrentMaterialIndex(lastAccessed.index);
        setSelectedMaterial(lastAccessed.material);
        onMaterialSelect(lastAccessed.material);
      }
      
      setIsInitialized(true);
    }
  }, [studyMaterials, progressData, isInitialized, onMaterialSelect]);

  const goToNext = () => {
    if (hasNextMaterial()) {
      const nextIndex = currentMaterialIndex + 1;
      const nextMaterial = studyMaterials[nextIndex];
      setCurrentMaterialIndex(nextIndex);
      setSelectedMaterial(nextMaterial);
      setSelectedAssessment(null);
      onMaterialSelect(nextMaterial);
    }
  };

  const goToPrevious = () => {
    if (hasPreviousMaterial()) {
      const prevIndex = currentMaterialIndex - 1;
      const prevMaterial = studyMaterials[prevIndex];
      setCurrentMaterialIndex(prevIndex);
      setSelectedMaterial(prevMaterial);
      setSelectedAssessment(null);
      onMaterialSelect(prevMaterial);
    }
  };

  const handleMaterialSelect = (material: any) => {
    const index = studyMaterials.findIndex(m => m.id === material.id);
    setCurrentMaterialIndex(index);
    setSelectedMaterial(material);
    setSelectedAssessment(null);
    onMaterialSelect(material);
  };

  const handleAssessmentSelect = (assessment: any) => {
    setSelectedAssessment(assessment);
    setSelectedMaterial(null);
    onAssessmentSelect(assessment);
  };

  return {
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
  };
};
