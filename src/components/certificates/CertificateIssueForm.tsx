
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Award, User, BookOpen, CheckCircle, Users } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
}

interface CertificateIssueFormProps {
  onIssue: (student: any, courseId: string) => Promise<boolean>;
  loading: boolean;
}

const CertificateIssueForm = ({ onIssue, loading }: CertificateIssueFormProps) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const {
    searchName,
    setSearchName,
    searchResults,
    selectedStudent,
    isSearching,
    enrolledCourses,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent
  } = useStudentSearch();

  // Fetch available courses when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchAvailableCoursesForStudent();
    } else {
      setAvailableCourses([]);
      setSelectedCourse('');
    }
  }, [selectedStudent, enrolledCourses]);

  const fetchAvailableCoursesForStudent = async () => {
    if (!selectedStudent) return;

    try {
      // Get existing certificates for this student
      const { data: existingCerts, error: certsError } = await (supabase as any)
        .from('certificates')
        .select('course_id')
        .eq('user_id', selectedStudent.id);

      if (certsError) {
        console.error('Error fetching existing certificates:', certsError);
        return;
      }

      // Get the course IDs that already have certificates
      const certifiedCourseIds = new Set(existingCerts?.map((cert: any) => cert.course_id) || []);

      // Filter enrolled courses to exclude those with existing certificates
      const coursesWithoutCertificates = enrolledCourses.filter(
        course => !certifiedCourseIds.has(course.id)
      );

      setAvailableCourses(coursesWithoutCertificates.map(course => ({
        id: course.id,
        title: course.title
      })));

      console.log('Available courses for certificate:', coursesWithoutCertificates);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const handleSearch = async () => {
    console.log('Starting search for:', searchName);
    await handleSearchStudent();
  };

  const handleSelectAndContinue = async (student: any) => {
    console.log('Student selected for certificate issue:', student);
    await handleSelectStudent(student);
  };

  const handleIssue = async () => {
    const success = await onIssue(selectedStudent, selectedCourse);
    if (success) {
      setSelectedCourse('');
      handleClearStudent();
    }
  };

  console.log('Certificate Issue Form state:', { searchResults, selectedStudent, searchName, isSearching, enrolledCourses, availableCourses });

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/50">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          Issue New Certificate
        </CardTitle>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          Select a student and course to issue a certificate. Only enrolled courses without existing certificates are shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Search Section */}
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
                  placeholder="Enter student name to search..."
                  className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchName.trim()}
                variant="outline"
                className="px-4 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {isSearching ? 'Searching...' : <Search className="w-4 h-4" />}
              </Button>
              {(selectedStudent || searchResults.length > 0) && (
                <Button 
                  onClick={handleClearStudent}
                  variant="outline"
                  className="px-4 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Search Results - Single Column */}
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
                    onClick={() => handleSelectAndContinue(student)}
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
                          handleSelectAndContinue(student);
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
                <div>
                  <p className="font-semibold text-emerald-800">{selectedStudent.full_name}</p>
                  <p className="text-sm text-emerald-600">{selectedStudent.email}</p>
                  <p className="text-xs text-emerald-700 mt-2 font-medium">
                    {enrolledCourses.length} enrolled courses • {availableCourses.length} available for certification
                  </p>
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
        
        {/* Course Selection Section */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Available Courses
          </Label>
          <Select 
            value={selectedCourse} 
            onValueChange={setSelectedCourse}
            disabled={!selectedStudent || availableCourses.length === 0}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors">
              <SelectValue placeholder={
                !selectedStudent 
                  ? "Select a student first" 
                  : availableCourses.length === 0 
                  ? "No courses available for certification" 
                  : "Select a course to certify"
              } />
            </SelectTrigger>
            <SelectContent>
              {availableCourses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedStudent && availableCourses.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 font-medium">
                This student either has no enrollments or already has certificates for all enrolled courses.
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Button 
            onClick={handleIssue}
            disabled={loading || !selectedStudent || !selectedCourse}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Award className="w-5 h-5 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateIssueForm;
