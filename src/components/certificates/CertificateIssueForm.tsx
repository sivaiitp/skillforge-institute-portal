
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { supabase } from '@/integrations/supabase/client';
import CertificateSuccessView from './CertificateSuccessView';
import StudentSearchSection from './StudentSearchSection';
import CourseSelectionSection from './CourseSelectionSection';

interface Course {
  id: string;
  title: string;
}

interface CertificateIssueFormProps {
  onIssue: (student: any, courseId: string) => Promise<any>;
  loading: boolean;
}

const CertificateIssueForm = ({ onIssue, loading }: CertificateIssueFormProps) => {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [issuedCertificate, setIssuedCertificate] = useState<any>(null);
  
  const {
    searchName,
    setSearchName,
    searchResults,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent
  } = useStudentSearch();

  // Fetch available courses when a student is selected
  useEffect(() => {
    if (selectedStudent && enrolledCourses.length > 0) {
      fetchAvailableCoursesForStudent();
    } else {
      setAvailableCourses([]);
      setSelectedCourse('');
    }
  }, [selectedStudent, enrolledCourses]);

  const fetchAvailableCoursesForStudent = async () => {
    if (!selectedStudent) return;

    try {
      console.log('Fetching certificates for student:', selectedStudent.id);
      console.log('Enrolled courses:', enrolledCourses);

      // Get existing certificates for this student
      const { data: existingCerts, error: certsError } = await (supabase as any)
        .from('certificates')
        .select('course_id')
        .eq('user_id', selectedStudent.id)
        .eq('is_valid', true);

      if (certsError) {
        console.error('Error fetching existing certificates:', certsError);
        return;
      }

      console.log('Existing certificates:', existingCerts);

      // Get the course IDs that already have certificates
      const certifiedCourseIds = new Set(existingCerts?.map((cert: any) => cert.course_id) || []);
      console.log('Certified course IDs:', certifiedCourseIds);

      // Filter enrolled courses to exclude those with existing certificates
      const coursesWithoutCertificates = enrolledCourses.filter(
        course => !certifiedCourseIds.has(course.id)
      );

      console.log('Courses without certificates:', coursesWithoutCertificates);

      setAvailableCourses(coursesWithoutCertificates.map(course => ({
        id: course.id,
        title: course.title
      })));

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
    const certificate = await onIssue(selectedStudent, selectedCourse);
    if (certificate) {
      setIssuedCertificate(certificate);
      setSelectedCourse('');
      handleClearStudent();
    }
  };

  const handleStartNew = () => {
    setIssuedCertificate(null);
  };

  console.log('Certificate Issue Form state:', { 
    searchResults: searchResults.length, 
    selectedStudent: selectedStudent?.full_name, 
    searchName, 
    isSearching, 
    enrolledCourses: enrolledCourses.length, 
    availableCourses: availableCourses.length,
    loadingEnrollments,
    issuedCertificate: issuedCertificate?.certificate_number
  });

  // Show certificate success view if a certificate was just issued
  if (issuedCertificate) {
    return (
      <CertificateSuccessView
        certificate={issuedCertificate}
        onStartNew={handleStartNew}
      />
    );
  }

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
        <StudentSearchSection
          searchName={searchName}
          setSearchName={setSearchName}
          searchResults={searchResults}
          selectedStudent={selectedStudent}
          isSearching={isSearching}
          enrolledCourses={enrolledCourses}
          availableCourses={availableCourses}
          loadingEnrollments={loadingEnrollments}
          onSearch={handleSearch}
          onSelectStudent={handleSelectAndContinue}
          onClearStudent={handleClearStudent}
        />
        
        <CourseSelectionSection
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          selectedStudent={selectedStudent}
          availableCourses={availableCourses}
          enrolledCourses={enrolledCourses}
          loadingEnrollments={loadingEnrollments}
        />
        
        <div className="pt-4 border-t border-gray-100">
          <Button 
            onClick={handleIssue}
            disabled={loading || !selectedStudent || !selectedCourse || loadingEnrollments}
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
