
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Award } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  points: number;
}

interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  score: number;
  total_marks: number;
  passed: boolean;
  time_spent: number;
  answers: Record<string, string>;
  completed_at: string;
  assessments: {
    title: string;
    description: string;
    passing_marks: number;
    courses: { title: string } | null;
  };
}

interface AssessmentStatsGridProps {
  attempt: AssessmentAttempt;
  questions: Question[];
}

const AssessmentStatsGrid = ({ attempt, questions }: AssessmentStatsGridProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getAnswerStatus = (question: Question) => {
    const userAnswer = attempt?.answers[question.id];
    const isCorrect = userAnswer && userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
    return { userAnswer, isCorrect };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <p className="font-semibold">Time Taken</p>
        <p className="text-blue-600">{formatTime(attempt.time_spent)}</p>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-semibold">Correct Answers</p>
        <p className="text-green-600">
          {questions.filter(q => getAnswerStatus(q).isCorrect).length}/{questions.length}
        </p>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
        <p className="font-semibold">Status</p>
        <Badge variant={attempt.passed ? "default" : "destructive"}>
          {attempt.passed ? "PASSED" : "FAILED"}
        </Badge>
      </div>
    </div>
  );
};

export default AssessmentStatsGrid;
