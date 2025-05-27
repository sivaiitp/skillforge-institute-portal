
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Upload, Users, BookOpen, BarChart3 } from 'lucide-react';
import QuestionForm from './QuestionForm';
import QuestionsList from './QuestionsList';
import QuestionBank from './QuestionBank';
import QuestionImporter from './QuestionImporter';
import QuestionAssignment from './QuestionAssignment';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface EnhancedQuestionManagementProps {
  assessmentId: string;
  assessmentTitle: string;
}

const EnhancedQuestionManagement = ({ assessmentId, assessmentTitle }: EnhancedQuestionManagementProps) => {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalPoints: 0,
    questionTypes: {} as Record<string, number>
  });

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

  useEffect(() => {
    calculateStats();
  }, [questions]);

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

  const calculateStats = () => {
    const totalQuestions = questions.length;
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const questionTypes = questions.reduce((acc, q) => {
      acc[q.question_type] = (acc[q.question_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({ totalQuestions, totalPoints, questionTypes });
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
      setActiveTab('questions');
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
    setActiveTab('add');
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
    setActiveTab('add');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'true_false': return 'bg-green-100 text-green-800';
      case 'short_answer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Question Management</h1>
            <p className="text-gray-600">{assessmentTitle}</p>
          </div>
          <Button 
            onClick={handleAddQuestion}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Question Types</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.questionTypes).map(([type, count]) => (
                <Badge key={type} className={getTypeColor(type)}>
                  {type.replace('_', ' ')}: {count}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white border rounded-lg p-1">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </TabsTrigger>
          <TabsTrigger value="assign" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Assign Existing
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Question Bank
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <QuestionsList
            questions={questions}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <QuestionForm
            editingQuestion={editingQuestion}
            formData={formData}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onFormDataChange={setFormData}
          />
        </TabsContent>

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
      </Tabs>
    </div>
  );
};

export default EnhancedQuestionManagement;
