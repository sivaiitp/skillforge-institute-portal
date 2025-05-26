
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  enrolledCoursesCount: number;
}

export function EmptyState({ enrolledCoursesCount }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
      <CardContent>
        <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <FolderOpen className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Study Materials</h3>
        <p className="text-gray-600 mb-8 text-lg">
          {enrolledCoursesCount === 0 
            ? "You need to enroll in courses to access study materials."
            : "No study materials available for your enrolled courses yet."
          }
        </p>
        {enrolledCoursesCount === 0 && (
          <Button 
            onClick={() => navigate('/courses')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 text-lg"
          >
            Browse Courses
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
