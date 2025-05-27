import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Award, User, BookOpen, CheckCircle, Users, Eye, Download } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { supabase } from '@/integrations/supabase/client';
import CertificateViewModal from './CertificateViewModal';
import { downloadCertificateAsPDF } from '@/utils/certificateUtils';

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
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  
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

  const handleViewCertificate = () => {
    setShowCertificateModal(true);
  };

  const handleDownloadCertificate = () => {
    if (issuedCertificate) {
      downloadCertificateAsPDF(issuedCertificate);
    }
  };

  const handleCloseModal = () => {
    setShowCertificateModal(false);
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Certificate Issued Successfully!
          </CardTitle>
          <CardDescription className="text-base text-gray-600 leading-relaxed">
            The certificate has been generated and is ready for viewing and download.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-emerald-800 text-lg">
                Certificate Details
              </h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <p><strong>Student:</strong> {issuedCertificate.profiles?.full_name}</p>
                <p><strong>Course:</strong> {issuedCertificate.courses?.title}</p>
                <p><strong>Certificate ID:</strong> <span className="font-mono">{issuedCertificate.certificate_number}</span></p>
                <p><strong>Issue Date:</strong> {new Date(issuedCertificate.issued_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleViewCertificate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
            <Button
              onClick={handleDownloadCertificate}
              variant="outline"
              className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-6 py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="px-6 py-2"
            >
              Issue Another Certificate
            </Button>
          </div>
        </CardContent>

        <CertificateViewModal
          certificate={issuedCertificate}
          isOpen={showCertificateModal}
          onClose={handleCloseModal}
          onDownload={handleDownloadCertificate}
        />
      </Card>
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
                  placeholder="Enter student name or email to search..."
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
        
        {/* Course Selection Section */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Available Courses for Certification
          </Label>
          <Select 
            value={selectedCourse} 
            onValueChange={setSelectedCourse}
            disabled={!selectedStudent || availableCourses.length === 0 || loadingEnrollments}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-colors">
              <SelectValue placeholder={
                !selectedStudent 
                  ? "Select a student first" 
                  : loadingEnrollments
                  ? "Loading enrollments..."
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
          {selectedStudent && !loadingEnrollments && enrolledCourses.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 font-medium">
                This student has no active enrollments.
              </p>
            </div>
          )}
          {selectedStudent && !loadingEnrollments && enrolledCourses.length > 0 && availableCourses.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 font-medium">
                This student already has certificates for all enrolled courses.
              </p>
            </div>
          )}
        </div>
        
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
