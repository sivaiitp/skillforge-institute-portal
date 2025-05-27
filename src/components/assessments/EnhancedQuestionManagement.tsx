
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import QuestionImporter from './QuestionImporter';
import QuestionAssignment from './QuestionAssignment';
import QuestionBank from './QuestionBank';
import QuestionManagementHeader from './QuestionManagementHeader';
import QuestionManagementStats from './QuestionManagementStats';
import QuestionManagementTabs from './QuestionManagementTabs';
import QuestionFormTab from './QuestionFormTab';
import QuestionsList from './QuestionsList';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';

interface EnhancedQuestionManagementProps {
  assessmentId: string;
  assessmentTitle: string;
}

const EnhancedQuestionManagement = ({ assessmentId, assessmentTitle }: EnhancedQuestionManagementProps) => {
  const [activeTab, setActiveTab] = useState('questions');
  
  const {
    questions,
    loading,
    editingQuestion,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    fetchQuestions
  } = useQuestionManagement(assessmentId);

  const handleAddQuestion = () => {
    resetForm();
    setActiveTab('add');
  };

  const handleEditQuestion = (question: any) => {
    handleEdit(question);
    setActiveTab('add');
  };

  return (
    <div className="space-y-6">
      <QuestionManagementHeader 
        assessmentTitle={assessmentTitle}
        onAddQuestion={handleAddQuestion}
      />

      <QuestionManagementStats questions={questions} />

      <QuestionManagementTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <TabsContent value="questions" className="space-y-4">
          <QuestionsList
            questions={questions}
            loading={loading}
            onEdit={handleEditQuestion}
            onDelete={handleDelete}
          />
        </TabsContent>

        <QuestionFormTab
          editingQuestion={editingQuestion}
          formData={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onFormDataChange={setFormData}
          onActiveTabChange={setActiveTab}
        />

        <TabsContent value="import" className="space-y-4">
          <QuestionImporter
            assessmentId={assessmentId}
            onImportComplete={fetchQuestions}
          />
        </TabsContent>

        <TabsContent value="assign" className="space-y-4">
          <QuestionAssignment
            currentAssessmentId={assessmentId}
            onAssignmentComplete={fetchQuestions}
          />
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <QuestionBank mode="manage" />
        </TabsContent>
      </QuestionManagementTabs>
    </div>
  );
};

export default EnhancedQuestionManagement;
