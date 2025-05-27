
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, EnrolledCourse } from '@/types/certificateIssuing';

export const useCertificateGeneration = () => {
  const [isIssuingCertificate, setIsIssuingCertificate] = useState(false);

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    return `CERT-${year}-${timestamp.toString().slice(-6)}`;
  };

  const issueCertificate = async (
    selectedUser: User | null,
    selectedCourse: string,
    enrolledCourses: EnrolledCourse[]
  ) => {
    if (!selectedUser || !selectedCourse) {
      toast.error('Please select both user and course');
      return false;
    }

    const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);
    if (selectedCourseData?.has_certificate) {
      toast.error('User already has a certificate for this course');
      return false;
    }

    setIsIssuingCertificate(true);
    try {
      const certificateNumber = generateCertificateNumber();
      
      const { error } = await supabase
        .from('certificates')
        .insert({
          user_id: selectedUser.id,
          course_id: selectedCourse,
          certificate_number: certificateNumber,
          certificate_id: certificateNumber,
          issued_date: new Date().toISOString(),
          is_valid: true
        });

      if (error) {
        console.error('Error issuing certificate:', error);
        toast.error('Error issuing certificate');
        return false;
      }

      toast.success(`Certificate issued successfully! Number: ${certificateNumber}`);
      return true;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error('Error issuing certificate');
      return false;
    } finally {
      setIsIssuingCertificate(false);
    }
  };

  return {
    isIssuingCertificate,
    issueCertificate,
  };
};
