
import React from 'react';
import { QuestionManagementProps } from '@/types/questionTypes';
import { useQuestionManagementLogic } from '@/hooks/useQuestionManagementLogic';
import QuestionManagementHeader from './QuestionManagementHeader';
import QuestionForm from './QuestionForm';
import QuestionsList from './QuestionsList';

const QuestionManagement = ({ assessmentId, assessmentTitle }: QuestionManagementProps) => {
  const {
    questions,
    showForm,
    editingQuestion,
    loading,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    handleAddQuestion
  } = useQuestionManagementLogic(assessmentId);

  return (
    <div className="space-y-6">
      <QuestionManagementHeader 
        assessmentTitle={assessmentTitle}
        onAddQuestion={handleAddQuestion}
      />

      {showForm && (
        <QuestionForm
          editingQuestion={editingQuestion}
          formData={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onFormDataChange={setFormData}
        />
      )}

      <QuestionsList
        questions={questions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default QuestionManagement;
