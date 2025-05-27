
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Award } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
}

interface CertificateIssueFormProps {
  onIssue: (student: any, courseId: string) => Promise<boolean>;
  onCancel: () => void;
  loading: boolean;
}

const CertificateIssueForm = ({ onIssue, onCancel, loading }: CertificateIssueFormProps) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const {
    searchName,
    setSearchName,
    selectedStudent,
    isSearching,
    enrolledCourses,
    handleSearchStudent,
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

  const handleIssue = async () => {
    const success = await onIssue(selectedStudent, selectedCourse);
    if (success) {
      setSelectedCourse('');
      handleClearStudent();
    }
  };

  const handleCancel = () => {
    onCancel();
    handleClearStudent();
    setSelectedCourse('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Issue New Certificate</CardTitle>
        <CardDescription>
          Select a student and course to issue a certificate. Only enrolled courses without existing certificates are shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Search Student</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter student name"
              />
              <Button 
                onClick={handleSearchStudent}
                disabled={isSearching}
                variant="outline"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            {selectedStudent && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                <p className="font-medium">{selectedStudent.full_name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {enrolledCourses.length} enrolled courses, {availableCourses.length} available for certification
                </p>
              </div>
            )}
          </div>
          
          <div>
            <Label>Course (Enrolled & No Certificate)</Label>
            <Select 
              value={selectedCourse} 
              onValueChange={setSelectedCourse}
              disabled={!selectedStudent || availableCourses.length === 0}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={
                  !selectedStudent 
                    ? "Select a student first" 
                    : availableCourses.length === 0 
                    ? "No courses available for certification" 
                    : "Select a course"
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
              <p className="text-sm text-amber-600 mt-1">
                This student either has no enrollments or already has certificates for all enrolled courses.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleIssue}
            disabled={loading || !selectedStudent || !selectedCourse}
            className="bg-green-600 hover:bg-green-700"
          >
            <Award className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
          <Button 
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateIssueForm;
