
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface AssessmentDetailedReviewProps {
  attempt: AssessmentAttempt;
  questions: Question[];
}

const AssessmentDetailedReview = ({ attempt, questions }: AssessmentDetailedReviewProps) => {
  const getAnswerStatus = (question: Question) => {
    const userAnswer = attempt?.answers[question.id];
    const isCorrect = userAnswer && userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
    return { userAnswer, isCorrect };
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>Detailed Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const { userAnswer, isCorrect } = getAnswerStatus(question);
            return (
              <div key={question.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCorrect ? "default" : "destructive"}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                    <span className="text-sm text-gray-500">{question.points} pts</span>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3">{question.question_text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Your Answer:</p>
                    <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {userAnswer || "No answer provided"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Correct Answer:</p>
                    <p className="text-green-600">{question.correct_answer}</p>
                  </div>
                </div>
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800 mb-1">Explanation:</p>
                    <p className="text-blue-700 text-sm">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentDetailedReview;
