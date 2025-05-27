
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import QuestionForm from './QuestionForm';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  sort_order: number;
}

interface QuestionFormTabProps {
  editingQuestion: Question | null;
  formData: {
    question_text: string;
    question_type: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    points: number;
  };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<boolean>;
  onCancel: () => void;
  onFormDataChange: (data: any) => void;
  onActiveTabChange: (tab: string) => void;
}

const QuestionFormTab = ({
  editingQuestion,
  formData,
  loading,
  onSubmit,
  onCancel,
  onFormDataChange,
  onActiveTabChange
}: QuestionFormTabProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    const success = await onSubmit(e);
    if (success) {
      onActiveTabChange('questions');
    }
  };

  return (
    <TabsContent value="add" className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-6">
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
    </TabsContent>
  );
};

export default QuestionFormTab;
