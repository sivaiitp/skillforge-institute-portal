
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';
import { useCertificateIssuing } from '@/hooks/useCertificateIssuing';
import UserSearchForm from './UserSearchForm';
import CourseSelectionSection from './CourseSelectionSection';

interface NewIssueCertificateFormProps {
  onCertificateIssued: () => void;
}

const NewIssueCertificateForm = ({ onCertificateIssued }: NewIssueCertificateFormProps) => {
  console.log('NewIssueCertificateForm rendering...');
  
  const {
    searchName,
    setSearchName,
    selectedUser,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    selectedCourse,
    setSelectedCourse,
    isIssuingCertificate,
    searchUsers,
    issueCertificate,
    clearForm,
  } = useCertificateIssuing();

  console.log('Hook state:', {
    selectedUser,
    enrolledCourses,
    selectedCourse,
    isSearching,
    loadingEnrollments,
    isIssuingCertificate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    const success = await issueCertificate();
    if (success) {
      onCertificateIssued();
    }
  };

  const availableCourses = enrolledCourses.filter(course => !course.has_certificate);
  const isFormValid = selectedUser && selectedCourse && availableCourses.length > 0;

  console.log('Form validation:', {
    selectedUser: !!selectedUser,
    selectedCourse: !!selectedCourse,
    availableCoursesCount: availableCourses.length,
    isFormValid
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UserSearchForm
        searchName={searchName}
        setSearchName={setSearchName}
        selectedUser={selectedUser}
        isSearching={isSearching}
        onSearchUser={searchUsers}
        onClearUser={clearForm}
      />

      {selectedUser && (
        <CourseSelectionSection
          enrolledCourses={enrolledCourses}
          loadingEnrollments={loadingEnrollments}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      )}

      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={!isFormValid || isIssuingCertificate}
      >
        {isIssuingCertificate ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Issuing Certificate...
          </>
        ) : (
          <>
            <Award className="w-5 h-5 mr-2" />
            Issue Certificate
          </>
        )}
      </Button>
    </form>
  );
};

export default NewIssueCertificateForm;
