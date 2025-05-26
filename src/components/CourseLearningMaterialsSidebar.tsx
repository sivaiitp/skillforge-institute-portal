
import { useState, useEffect } from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FileText, Video, FileImage, File, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { useAuth } from "./AuthProvider";

interface Material {
  id: string;
  title: string;
  mime_type: string;
  file_url: string;
  description?: string;
}

interface CourseLearningMaterialsSidebarProps {
  courseId: string;
  selectedMaterialId: string | null;
  onSelectMaterial: (material: Material) => void;
}

export function CourseLearningMaterialsSidebar({ 
  courseId, 
  selectedMaterialId, 
  onSelectMaterial 
}: CourseLearningMaterialsSidebarProps) {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [progressData, setProgressData] = useState([]);
  const { getStudyProgress } = useStudyProgress();

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  useEffect(() => {
    const loadProgress = async () => {
      if (courseId && materials.length > 0) {
        const courseProgress = await getStudyProgress(courseId);
        setProgressData(courseProgress);
      }
    };
    
    if (materials.length > 0) {
      loadProgress();
    }
  }, [materials, courseId]);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('id, title, mime_type, file_url, description')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes('pdf')) return FileText;
    if (mimeType?.includes('video')) return Video;
    if (mimeType?.includes('image')) return FileImage;
    return File;
  };

  const getMaterialProgress = (materialId: string) => {
    return progressData.find(p => p.study_material_id === materialId);
  };

  const getShortTitle = (title: string) => {
    // Remove common prefixes and suffixes
    let shortTitle = title
      .replace(/^(full_stack_web_development_|web_development_|course_|lesson_|chapter_)/i, '')
      .replace(/\.(md|pdf|mp4|jpg|jpeg|png|gif)$/i, '')
      .replace(/_/g, ' ')
      .replace(/^\d+_?/, '') // Remove leading numbers
      .trim();
    
    // Capitalize first letter of each word
    shortTitle = shortTitle.replace(/\b\w/g, l => l.toUpperCase());
    
    // If still too long, truncate
    if (shortTitle.length > 25) {
      shortTitle = shortTitle.substring(0, 22) + '...';
    }
    
    return shortTitle || 'Material';
  };

  const getHoverContent = (material: Material) => {
    return material.description || material.title;
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-1 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide">
            Course Materials
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {materials.map((material) => {
                const FileIcon = getFileIcon(material.mime_type);
                const progress = getMaterialProgress(material.id);
                const isCompleted = progress?.completed || false;
                const isSelected = selectedMaterialId === material.id;
                const shortTitle = getShortTitle(material.title);
                const hoverContent = getHoverContent(material);
                
                return (
                  <SidebarMenuItem key={material.id}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <SidebarMenuButton 
                          onClick={() => onSelectMaterial(material)}
                          isActive={isSelected}
                          className="w-full justify-start h-auto px-4 py-3 mb-0.5 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-900 data-[active=true]:border-blue-200 data-[active=true]:shadow-sm group"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <FileIcon className="w-5 h-5 group-data-[active=true]:text-blue-600 flex-shrink-0" />
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-medium text-sm truncate">{shortTitle}</div>
                              <div className="text-xs text-sidebar-foreground/60 group-data-[active=true]:text-blue-700/70">
                                {material.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                              </div>
                            </div>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        </SidebarMenuButton>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80" side="right">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-muted-foreground">
                              {material.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <FileIcon className="w-3 h-3" />
                            <span>{material.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                            {isCompleted && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Completed
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
