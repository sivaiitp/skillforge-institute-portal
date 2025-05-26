
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Course {
  id: string;
  title: string;
}

interface MaterialsFilterProps {
  selectedCourse: string;
  onCourseChange: (courseId: string) => void;
  enrolledCourses: Course[];
}

export function MaterialsFilter({ selectedCourse, onCourseChange, enrolledCourses }: MaterialsFilterProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-emerald-100">
        <Search className="h-5 w-5 text-emerald-500" />
        <Select value={selectedCourse} onValueChange={onCourseChange}>
          <SelectTrigger className="w-64 border-emerald-200 focus:border-emerald-400">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {enrolledCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
