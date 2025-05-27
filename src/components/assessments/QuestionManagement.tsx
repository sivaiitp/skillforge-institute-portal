
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import QuestionManagementHeader from './QuestionManagementHeader';
import QuestionForm from './QuestionForm';
import QuestionsList from './QuestionsList';

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

interface QuestionManagementProps {
  assessmentId: string;
  assessmentTitle: string;
}

const QuestionManagement = ({ assessmentId, assessmentTitle }: QuestionManagementProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1
  });

  useEffect(() => {
    fetchQuestions();
  }, [assessmentId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('sort_order');

      if (error) throw error;
      
      const transformedQuestions: Question[] = (data || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options ? (q.options as string[]) : null,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        sort_order: q.sort_order
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      toast.error('Error fetching questions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (formData.question_type === 'multiple_choice' && formData.options.some(opt => !opt.trim())) {
      toast.error('All options must be filled for multiple choice questions');
      return;
    }

    try {
      setLoading(true);
      const questionData = {
        assessment_id: assessmentId,
        question_text: formData.question_text,
        question_type: formData.question_type,
        options: formData.question_type === 'multiple_choice' ? formData.options : null,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation || null,
        points: formData.points,
        sort_order: editingQuestion ? editingQuestion.sort_order : questions.length
      };

      let result;
      if (editingQuestion) {
        result = await supabase
          .from('assessment_questions')
          .update(questionData)
          .eq('id', editingQuestion.id)
          .select();
      } else {
        result = await supabase
          .from('assessment_questions')
          .insert([questionData])
          .select();
      }

      if (result.error) throw result.error;

      toast.success(`Question ${editingQuestion ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving question');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options || ['', '', '', ''],
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      points: question.points
    });
    setShowForm(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('assessment_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      toast.success('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      toast.error('Error deleting question');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setFormData({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      points: 1
    });
  };

  const handleAddQuestion = () => {
    setShowForm(true);
  };

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
