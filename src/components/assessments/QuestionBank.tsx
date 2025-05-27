
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Search, BookOpen, Filter, Eye, Copy, Trash2, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  assessment_id: string;
  assessment_title?: string;
}

interface QuestionBankProps {
  onSelectQuestion?: (question: Question) => void;
  selectedQuestions?: string[];
  mode?: 'select' | 'manage';
}

const QuestionBank = ({ onSelectQuestion, selectedQuestions = [], mode = 'manage' }: QuestionBankProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, filterType]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_questions')
        .select(`
          *,
          assessments(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedQuestions = (data || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options as string[] | null,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        assessment_id: q.assessment_id,
        assessment_title: q.assessments?.title
      }));

      setQuestions(transformedQuestions);
    } catch (error) {
      toast.error('Error fetching questions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.assessment_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(q => q.question_type === filterType);
    }

    setFilteredQuestions(filtered);
  };

  const handleCopyQuestion = async (question: Question) => {
    try {
      const newQuestion = {
        question_text: `Copy of ${question.question_text}`,
        question_type: question.question_type,
        options: question.options,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        points: question.points,
        assessment_id: question.assessment_id,
        sort_order: 0
      };

      const { error } = await supabase
        .from('assessment_questions')
        .insert([newQuestion]);

      if (error) throw error;

      toast.success('Question copied successfully!');
      fetchQuestions();
    } catch (error) {
      toast.error('Error copying question');
      console.error('Error:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'true_false': return 'bg-green-100 text-green-800';
      case 'short_answer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <CardTitle>Question Bank ({filteredQuestions.length})</CardTitle>
          </div>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search questions or assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions found. {searchTerm || filterType !== 'all' ? 'Try adjusting your filters.' : 'Add some questions to get started.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id} 
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  selectedQuestions.includes(question.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${mode === 'select' ? 'cursor-pointer' : ''}`}
                onClick={() => mode === 'select' && onSelectQuestion?.(question)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {question.question_text}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(question.question_type)}>
                        {question.question_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{question.points} points</Badge>
                      {question.assessment_title && (
                        <Badge variant="secondary">{question.assessment_title}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {mode === 'manage' && (
                    <div className="flex gap-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyQuestion(question)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {question.options && (
                  <div className="mb-2">
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option, idx) => (
                        <div 
                          key={idx} 
                          className={`text-sm p-2 rounded border ${
                            option === question.correct_answer 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-green-600 font-medium">
                  Correct: {question.correct_answer}
                </div>

                {question.explanation && (
                  <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionBank;
