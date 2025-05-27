
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

interface QuestionDisplayProps {
  question: Question;
  questionIndex: number;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

const QuestionDisplay = ({ question, questionIndex, answers, onAnswerChange }: QuestionDisplayProps) => {
  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-start justify-between">
          <span className="leading-relaxed">Question {questionIndex + 1}</span>
          <Badge variant="secondary" className="text-sm px-3 py-1 font-semibold">
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-gray-800 font-medium">
            {question.question_text}
          </p>
        </div>

        <div className="space-y-3">
          {question.question_type === 'multiple_choice' && question.options && (
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={(value) => onAnswerChange(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      className="mt-0.5 w-4 h-4"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="flex-1 text-base leading-relaxed cursor-pointer text-gray-700 group-hover:text-gray-900"
                    >
                      <span className="font-medium text-gray-500 mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.question_type === 'true_false' && (
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={(value) => onAnswerChange(question.id, value)}
              className="space-y-3"
            >
              <div className="group">
                <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer">
                  <RadioGroupItem value="true" id="true" className="mt-0.5 w-4 h-4" />
                  <Label htmlFor="true" className="flex-1 text-base cursor-pointer text-gray-700 group-hover:text-gray-900">
                    <span className="font-medium text-gray-500 mr-2">A.</span>
                    True
                  </Label>
                </div>
              </div>
              <div className="group">
                <div className="flex items-start space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer">
                  <RadioGroupItem value="false" id="false" className="mt-0.5 w-4 h-4" />
                  <Label htmlFor="false" className="flex-1 text-base cursor-pointer text-gray-700 group-hover:text-gray-900">
                    <span className="font-medium text-gray-500 mr-2">B.</span>
                    False
                  </Label>
                </div>
              </div>
            </RadioGroup>
          )}

          {question.question_type === 'short_answer' && (
            <div className="space-y-2">
              <Label htmlFor="answer-input" className="text-base font-medium text-gray-700">
                Your Answer
              </Label>
              <Input
                id="answer-input"
                value={answers[question.id] || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="text-base p-3 border-2 focus:border-blue-500 rounded-lg"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
