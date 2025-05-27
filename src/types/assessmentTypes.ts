
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface CategoryScore {
  correct: number;
  total: number;
}

export interface AssessmentResults {
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  categoryScores: { [key: string]: CategoryScore };
}
