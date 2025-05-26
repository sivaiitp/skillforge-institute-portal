
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface CertificateIssueButtonProps {
  isLoading: boolean;
  selectedStudent: Student | null;
  selectedCourse: string;
  availableCoursesCount: number;
}

const CertificateIssueButton = ({
  isLoading,
  selectedStudent,
  selectedCourse,
  availableCoursesCount,
}: CertificateIssueButtonProps) => {
  const isDisabled = isLoading || !selectedStudent || !selectedCourse || availableCoursesCount === 0;

  return (
    <Button 
      type="submit" 
      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      disabled={isDisabled}
    >
      {isLoading ? (
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
  );
};

export default CertificateIssueButton;
