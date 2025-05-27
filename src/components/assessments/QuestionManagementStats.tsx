
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, BookOpen } from 'lucide-react';

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

interface QuestionManagementStatsProps {
  questions: Question[];
}

const QuestionManagementStats = ({ questions }: QuestionManagementStatsProps) => {
  const stats = {
    totalQuestions: questions.length,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    questionTypes: questions.reduce((acc, q) => {
      acc[q.question_type] = (acc[q.question_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
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
  );
};

export default QuestionManagementStats;
