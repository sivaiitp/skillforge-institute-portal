
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import StudentSearchSection from './StudentSearchSection';
import CourseSelectionSection from './CourseSelectionSection';
import CertificateIssueButton from './CertificateIssueButton';
import { useStudentSearch } from '@/hooks/useStudentSearch';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

interface IssueCertificateFormProps {
  students: Student[];
  courses: Course[];
  onCertificateIssued: () => void;
}

const IssueCertificateForm = ({ onCertificateIssued }: IssueCertificateFormProps) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    searchName,
    setSearchName,
    selectedStudent,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleClearStudent,
  } = useStudentSearch();

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const handleClearForm = () => {
    handleClearStudent();
    setSelectedCourse('');
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both student and course');
      return;
    }

    const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);
    if (selectedCourseData?.has_certificate) {
      toast.error('Student already has a certificate for this course');
      return;
    }

    setIsLoading(true);
    const certificateNumber = generateCertificateNumber();
    
    const { error } = await supabase
      .from('certificates')
      .insert({
        user_id: selectedStudent.id,
        course_id: selectedCourse,
        certificate_number: certificateNumber,
        certificate_id: certificateNumber,
        issued_date: new Date().toISOString(),
        is_valid: true
      });

    if (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
      setIsLoading(false);
      return;
    }

    toast.success(`Certificate issued successfully! Number: ${certificateNumber}`);
    handleClearForm();
    setIsLoading(false);
    onCertificateIssued();
  };

  const availableCourses = enrolledCourses.filter(course => !course.has_certificate);

  return (
    <form onSubmit={handleIssueCertificate} className="space-y-6">
      <StudentSearchSection
        searchName={searchName}
        setSearchName={setSearchName}
        selectedStudent={selectedStudent}
        isSearching={isSearching}
        onSearchStudent={handleSearchStudent}
        onClearStudent={handleClearForm}
      />

      {selectedStudent && (
        <CourseSelectionSection
          enrolledCourses={enrolledCourses}
          loadingEnrollments={loadingEnrollments}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />
      )}

      <CertificateIssueButton
        isLoading={isLoading}
        selectedStudent={selectedStudent}
        selectedCourse={selectedCourse}
        availableCoursesCount={availableCourses.length}
      />
    </form>
  );
};

export default IssueCertificateForm;
