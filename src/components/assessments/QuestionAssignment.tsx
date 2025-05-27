
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  assessment_id: string;
  assessment_title?: string;
}

interface QuestionAssignmentProps {
  currentAssessmentId: string;
  onAssignmentComplete: () => void;
}

const QuestionAssignment = ({ currentAssessmentId, onAssignmentComplete }: QuestionAssignmentProps) => {
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssessment, setFilterAssessment] = useState('all');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableQuestions();
    fetchAssessments();
  }, [currentAssessmentId]);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, title')
        .neq('id', currentAssessmentId)
        .order('title');

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchAvailableQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_questions')
        .select(`
          *,
          assessments(title)
        `)
        .neq('assessment_id', currentAssessmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedQuestions: Question[] = (data || []).map(q => ({
        id: q.id,
        question_text: q.question_text,
        question_type: q.question_type,
        points: q.points,
        assessment_id: q.assessment_id,
        assessment_title: q.assessments?.title
      }));

      setAvailableQuestions(transformedQuestions);
    } catch (error) {
      toast.error('Error fetching questions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAssignQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select questions to assign');
      return;
    }

    try {
      setLoading(true);
      
      // Get the questions to copy
      const { data: questionsData, error: fetchError } = await supabase
        .from('assessment_questions')
        .select('*')
        .in('id', selectedQuestions);

      if (fetchError) throw fetchError;

      // Create copies for the current assessment
      const questionsToInsert = questionsData.map(q => ({
        assessment_id: currentAssessmentId,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        points: q.points,
        sort_order: 0
      }));

      const { error: insertError } = await supabase
        .from('assessment_questions')
        .insert(questionsToInsert);

      if (insertError) throw insertError;

      toast.success(`Successfully assigned ${selectedQuestions.length} questions!`);
      setSelectedQuestions([]);
      onAssignmentComplete();
      fetchAvailableQuestions();
    } catch (error) {
      toast.error('Error assigning questions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = availableQuestions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.assessment_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAssessment === 'all' || q.assessment_id === filterAssessment;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'bg-blue-100 text-blue-800';
      case 'true_false': return 'bg-green-100 text-green-800';
      case 'short_answer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Assign Existing Questions
          </CardTitle>
          {selectedQuestions.length > 0 && (
            <Button 
              onClick={handleAssignQuestions}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Assign {selectedQuestions.length} Questions
            </Button>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterAssessment} onValueChange={setFilterAssessment}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by assessment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assessments</SelectItem>
              {assessments.map((assessment) => (
                <SelectItem key={assessment.id} value={assessment.id}>
                  {assessment.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No questions available to assign.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedQuestions.includes(question.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleQuestionToggle(question.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedQuestions.includes(question.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {question.question_text}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-7">
                      <Badge className={getTypeColor(question.question_type)}>
                        {question.question_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{question.points} points</Badge>
                      <Badge variant="secondary">{question.assessment_title}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedQuestions.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedQuestions.length} questions selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedQuestions([])}
                className="text-blue-600 border-blue-300"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionAssignment;
