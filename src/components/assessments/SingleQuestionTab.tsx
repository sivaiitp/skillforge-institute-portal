
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import QuestionForm from './QuestionForm';
import { Question, QuestionFormData } from '@/types/questionTypes';

interface SingleQuestionTabProps {
  editingQuestion: Question | null;
  formData: QuestionFormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<boolean>;
  onCancel: () => void;
  onFormDataChange: (data: QuestionFormData) => void;
  onActiveTabChange: (tab: string) => void;
}

const SingleQuestionTab = ({
  editingQuestion,
  formData,
  loading,
  onSubmit,
  onCancel,
  onFormDataChange,
  onActiveTabChange
}: SingleQuestionTabProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    const success = await onSubmit(e);
    if (success) {
      onActiveTabChange('questions');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Single Question</h3>
        <p className="text-sm text-gray-600">Create individual questions one at a time</p>
      </div>
      {editingQuestion && (
        <div className="flex items-center gap-2 mb-4 text-sm text-blue-600">
          <ArrowLeft className="w-4 h-4" />
          Editing question: {editingQuestion.question_text.substring(0, 50)}...
        </div>
      )}
      <QuestionForm
        editingQuestion={editingQuestion}
        formData={formData}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        onFormDataChange={onFormDataChange}
      />
    </div>
  );
};

export default SingleQuestionTab;
