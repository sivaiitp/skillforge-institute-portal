
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import AssessmentTaking from '@/components/assessments/AssessmentTaking';

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const { user, userRole } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to take this assessment.</p>
        </div>
      </div>
    );
  }

  if (!assessmentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Not Found</h2>
          <p className="text-gray-600">The requested assessment could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <AssessmentTaking assessmentId={assessmentId} />
    </div>
  );
};

export default TakeAssessment;
