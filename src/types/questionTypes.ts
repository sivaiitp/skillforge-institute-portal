
export interface Question {
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

export interface QuestionFormData {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  difficulty_level: string;
}

export interface QuestionManagementProps {
  assessmentId: string;
  assessmentTitle: string;
}
