
import React from 'react';
import QuestionImporter from './QuestionImporter';

interface BulkQuestionTabProps {
  assessmentId: string;
  onImportComplete: () => void;
}

const BulkQuestionTab = ({ assessmentId, onImportComplete }: BulkQuestionTabProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Import Bulk Questions</h3>
        <p className="text-sm text-gray-600">Upload multiple questions at once using CSV format</p>
      </div>
      <QuestionImporter
        assessmentId={assessmentId}
        onImportComplete={onImportComplete}
      />
    </div>
  );
};

export default BulkQuestionTab;
