
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Transform the data to match our Question interface
      const transformedQuestions: Question[] = (data || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: Array.isArray(q.options) ? q.options : null,
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

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Questions for: {assessmentTitle}</h2>
          <p className="text-gray-600">Manage questions for this assessment</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="question_text">Question Text</Label>
                <Textarea
                  id="question_text"
                  value={formData.question_text}
                  onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="question_type">Question Type</Label>
                  <Select 
                    value={formData.question_type} 
                    onValueChange={(value) => setFormData({...formData, question_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {formData.question_type === 'multiple_choice' && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="correct_answer">Correct Answer</Label>
                {formData.question_type === 'multiple_choice' ? (
                  <Select 
                    value={formData.correct_answer} 
                    onValueChange={(value) => setFormData({...formData, correct_answer: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.options.map((option, index) => (
                        option.trim() && (
                          <SelectItem key={index} value={option}>{option}</SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                ) : formData.question_type === 'true_false' ? (
                  <Select 
                    value={formData.correct_answer} 
                    onValueChange={(value) => setFormData({...formData, correct_answer: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
                    placeholder="Enter correct answer"
                    required
                  />
                )}
              </div>

              <div>
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                  rows={2}
                  placeholder="Explain why this is the correct answer"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingQuestion ? 'Update' : 'Create'} Question
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
          <CardDescription>
            Total Points: {questions.reduce((sum, q) => sum + q.points, 0)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions created yet. Add your first question to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="max-w-md">
                      <div className="truncate">{question.question_text}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {question.question_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{question.points}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManagement;
