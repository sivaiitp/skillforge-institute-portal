import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import StudentSearchSection from './StudentSearchSection';
import CourseSelectionSection from './CourseSelectionSection';
import CertificateIssueButton from './CertificateIssueButton';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  certification?: string;
}

interface IssueCertificateFormProps {
  students: Student[];
  courses: Course[];
  onCertificateIssued: () => void;
}

const IssueCertificateForm = ({ students, courses, onCertificateIssued }: IssueCertificateFormProps) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    searchEmail,
    setSearchEmail,
    selectedStudent,
    searchResults,
    isSearching,
    enrolledCourses,
    loadingEnrollments,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent,
  } = useStudentSearch();

  const generateCertificateNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CERT-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    if (enrolledCourses.length === 0) {
      toast.error('Student is not enrolled in any courses');
      return;
    }

    const isEnrolledInSelectedCourse = enrolledCourses.some(course => course.id === selectedCourse);
    if (!isEnrolledInSelectedCourse) {
      toast.error('Student is not enrolled in the selected course');
      return;
    }

    setIsLoading(true);

    try {
      const certificateNumber = generateCertificateNumber();
      
      const { error } = await supabase
        .from('certificates')
        .insert({
          user_id: selectedStudent.id,
          course_id: selectedCourse,
          certificate_number: certificateNumber,
          is_valid: true,
          issued_date: new Date().toISOString(),
        });

      if (error) {
        console.error('Error issuing certificate:', error);
        toast.error('Error issuing certificate');
        return;
      }

      toast.success(`Certificate issued successfully! Certificate Number: ${certificateNumber}`);
      
      setSelectedCourse('');
      handleClearStudent();
      onCertificateIssued();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StudentSearchSection
        searchEmail={searchEmail}
        setSearchEmail={setSearchEmail}
        selectedStudent={selectedStudent}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearchStudent={handleSearchStudent}
        onSelectStudent={handleSelectStudent}
        onClearStudent={handleClearStudent}
      />

      <CourseSelectionSection
        selectedStudent={selectedStudent}
        enrolledCourses={enrolledCourses}
        loadingEnrollments={loadingEnrollments}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />

      <CertificateIssueButton
        isLoading={isLoading}
        selectedStudent={selectedStudent}
        selectedCourse={selectedCourse}
        availableCoursesCount={enrolledCourses.length}
      />
    </form>
  );
};

export default IssueCertificateForm;
