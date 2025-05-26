
import { useState } from "react";
import { FileText, CheckCircle2, Circle, Clock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
  sort_order: number;
}

interface CourseLearningMaterialsSidebarProps {
  materials: Material[];
  selectedMaterialId: string | null;
  onMaterialSelect: (materialId: string) => void;
  progressData: any[];
  courseDuration?: string;
}

export function CourseLearningMaterialsSidebar({
  materials = [],
  selectedMaterialId,
  onMaterialSelect,
  progressData = [],
  courseDuration
}: CourseLearningMaterialsSidebarProps) {
  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const getShortTitle = (title: string) => {
    // Remove common prefixes and file extensions
    let shortTitle = title
      .replace(/^\d+[\._\-\s]*/, '') // Remove leading numbers and separators
      .replace(/^(chapter|lesson|module|part|section)[\s\-_]*\d*[\s\-_]*/i, '') // Remove chapter/lesson prefixes
      .replace(/\.(md|pdf|docx?|txt|html?)$/i, '') // Remove file extensions
      .trim();
    
    // Limit length and add ellipsis if needed
    if (shortTitle.length > 25) {
      shortTitle = shortTitle.substring(0, 22) + '...';
    }
    
    return shortTitle || title; // Fallback to original title if processing results in empty string
  };

  const getFileTypeIcon = (mimeType: string, fileUrl: string) => {
    if (!mimeType && !fileUrl) return FileText;
    
    const url = fileUrl?.toLowerCase() || '';
    const type = mimeType?.toLowerCase() || '';
    
    if (url.endsWith('.md') || url.endsWith('.markdown') || type.includes('markdown')) {
      return FileText;
    }
    
    return FileText; // Default icon
  };

  const completedCount = materials.filter(material => 
    getMaterialProgress(material.id)?.completed
  ).length;

  return (
    <TooltipProvider>
      <Sidebar className="w-80 border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <span>Course Materials</span>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{courseDuration || 'N/A'}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {completedCount} of {materials.length} completed
              </div>
            </SidebarGroupLabel>
            
            <SidebarGroupContent className="px-2 py-2">
              <SidebarMenu className="space-y-1">
                {materials.map((material, index) => {
                  const IconComponent = getFileTypeIcon(material.mime_type, material.file_url);
                  const isSelected = selectedMaterialId === material.id;
                  const isCompleted = getMaterialProgress(material.id)?.completed;
                  const shortTitle = getShortTitle(material.title);
                  
                  return (
                    <SidebarMenuItem key={material.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            onClick={() => onMaterialSelect(material.id)}
                            isActive={isSelected}
                            className={`
                              w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 
                              hover:bg-blue-50 hover:shadow-sm group
                              ${isSelected 
                                ? 'bg-blue-100 border border-blue-200 shadow-sm' 
                                : 'hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="flex-shrink-0 mt-0.5">
                                <IconComponent className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                                    {index + 1}
                                  </span>
                                  <div className="flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Circle className="h-3 w-3 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className={`text-sm font-medium mt-1 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                                  {shortTitle}
                                </div>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1">
                            <div className="font-medium">{material.title}</div>
                            {material.description && (
                              <div className="text-xs text-gray-600">{material.description}</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
