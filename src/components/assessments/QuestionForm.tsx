
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
  sort_order: number;
  difficulty_level: string;
}

interface QuestionFormProps {
  editingQuestion: Question | null;
  formData: {
    question_text: string;
    question_type: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    points: number;
    difficulty_level: string;
  };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFormDataChange: (data: any) => void;
}

const QuestionForm = ({ 
  editingQuestion, 
  formData, 
  loading, 
  onSubmit, 
  onCancel, 
  onFormDataChange 
}: QuestionFormProps) => {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    onFormDataChange({ ...formData, options: newOptions });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question_text">Question Text</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => onFormDataChange({...formData, question_text: e.target.value})}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="question_type">Question Type</Label>
              <Select 
                value={formData.question_type} 
                onValueChange={(value) => onFormDataChange({...formData, question_type: value})}
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
              <Label htmlFor="difficulty_level">Difficulty Level</Label>
              <Select 
                value={formData.difficulty_level} 
                onValueChange={(value) => onFormDataChange({...formData, difficulty_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
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
                onChange={(e) => onFormDataChange({...formData, points: parseInt(e.target.value)})}
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
                onValueChange={(value) => onFormDataChange({...formData, correct_answer: value})}
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
                onValueChange={(value) => onFormDataChange({...formData, correct_answer: value})}
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
                onChange={(e) => onFormDataChange({...formData, correct_answer: e.target.value})}
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
              onChange={(e) => onFormDataChange({...formData, explanation: e.target.value})}
              rows={2}
              placeholder="Explain why this is the correct answer"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {editingQuestion ? 'Update' : 'Create'} Question
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
