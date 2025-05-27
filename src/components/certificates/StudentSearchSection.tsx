
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, User, Users, CheckCircle } from 'lucide-react';

interface StudentSearchSectionProps {
  searchName: string;
  setSearchName: (name: string) => void;
  searchResults: any[];
  selectedStudent: any;
  isSearching: boolean;
  enrolledCourses: any[];
  availableCourses: any[];
  loadingEnrollments: boolean;
  onSearch: () => void;
  onSelectStudent: (student: any) => void;
  onClearStudent: () => void;
}

const StudentSearchSection = ({
  searchName,
  setSearchName,
  searchResults,
  selectedStudent,
  isSearching,
  enrolledCourses,
  availableCourses,
  loadingEnrollments,
  onSearch,
  onSelectStudent,
  onClearStudent
}: StudentSearchSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Search Student
        </Label>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter student name or email to search..."
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
          <Button 
            onClick={onSearch}
            disabled={isSearching || !searchName.trim()}
            variant="outline"
            className="px-4 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            {isSearching ? 'Searching...' : <Search className="w-4 h-4" />}
          </Button>
          {(selectedStudent || searchResults.length > 0) && (
            <Button 
              onClick={onClearStudent}
              variant="outline"
              className="px-4 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && !selectedStudent && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Search Results ({searchResults.length} found)
          </Label>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {searchResults.map((student) => (
              <div 
                key={student.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-pointer"
                onClick={() => onSelectStudent(student)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-blue-800 truncate">{student.full_name}</p>
                      <p className="text-sm text-blue-600 truncate">{student.email}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Student Display */}
      {selectedStudent && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-800">{selectedStudent.full_name}</p>
              <p className="text-sm text-emerald-600">{selectedStudent.email}</p>
              {loadingEnrollments ? (
                <p className="text-xs text-emerald-700 mt-2 font-medium">Loading enrollments...</p>
              ) : (
                <p className="text-xs text-emerald-700 mt-2 font-medium">
                  {enrolledCourses.length} enrolled course(s) • {availableCourses.length} available for certification
                </p>
              )}
              {enrolledCourses.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-emerald-600 font-medium">Enrolled in:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {enrolledCourses.map((course) => (
                      <span 
                        key={course.id} 
                        className={`text-xs px-2 py-1 rounded ${
                          course.has_certificate 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {course.title} {course.has_certificate ? '(Certified)' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {searchName && searchResults.length === 0 && !selectedStudent && !isSearching && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 font-medium text-center">
            No students found matching "{searchName}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearchSection;
