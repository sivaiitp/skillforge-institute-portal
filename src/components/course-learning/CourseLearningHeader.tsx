
import { BookOpen, ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseLearningHeaderProps {
  courseTitle?: string;
}

export function CourseLearningHeader({ courseTitle }: CourseLearningHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {courseTitle || 'Course Learning'}
        </h1>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Button>
    </header>
  );
}
