
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import QuestionAssignment from './QuestionAssignment';
import QuestionBank from './QuestionBank';
import QuestionManagementHeader from './QuestionManagementHeader';
import QuestionManagementStats from './QuestionManagementStats';
import QuestionManagementTabs from './QuestionManagementTabs';
import SingleQuestionTab from './SingleQuestionTab';
import BulkQuestionTab from './BulkQuestionTab';
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
    setActiveTab('single');
  };

  const handleEditQuestion = (question: any) => {
    handleEdit(question);
    setActiveTab('single');
  };

  return (
    <div className="space-y-6">
      <QuestionManagementHeader 
        assessmentTitle={assessmentTitle}
        onAddQuestion={handleAddQuestion}
      />

      <QuestionManagementStats questions={questions} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <QuestionManagementTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TabsContent value="questions" className="space-y-4">
          <QuestionsList
            questions={questions}
            loading={loading}
            onEdit={handleEditQuestion}
            onDelete={handleDelete}
          />
        </TabsContent>

        <SingleQuestionTab
          editingQuestion={editingQuestion}
          formData={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onFormDataChange={setFormData}
          onActiveTabChange={setActiveTab}
        />

        <BulkQuestionTab
          assessmentId={assessmentId}
          onImportComplete={fetchQuestions}
        />

        <TabsContent value="assign" className="space-y-4">
          <QuestionAssignment
            currentAssessmentId={assessmentId}
            onAssignmentComplete={fetchQuestions}
          />
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <QuestionBank mode="manage" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedQuestionManagement;
