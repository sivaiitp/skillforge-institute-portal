
import { Question } from "@/types/assessmentTypes";
import { questionBank } from "@/data/sampleQuestions";
import { UserPreferences } from "@/components/assessment/AssessmentPreferences";

export const generateCustomizedQuestions = (preferences: UserPreferences): Question[] => {
  const { specialization, experience } = preferences;
  
  // Get DSA questions (always 10 questions)
  const dsaQuestions = questionBank
    .filter(q => q.category === "Data Structures & Algorithms")
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Get specialized questions (10 questions from chosen specialization)
  const specializationQuestions = questionBank
    .filter(q => q.category === specialization)
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  // Combine and shuffle all questions
  const allQuestions = [...dsaQuestions, ...specializationQuestions]
    .sort(() => Math.random() - 0.5);

  // Apply difficulty filtering based on experience (optional enhancement)
  // For now, we'll return all questions since we don't have difficulty levels
  // In a real implementation, you might want to add difficulty levels to questions
  
  console.log(`Generated ${allQuestions.length} questions for ${specialization} specialization`);
  console.log(`DSA Questions: ${dsaQuestions.length}, ${specialization} Questions: ${specializationQuestions.length}`);
  
  return allQuestions;
};

export const calculatePersonalizedScore = (
  answers: number[], 
  questions: Question[], 
  preferences: UserPreferences
) => {
  let correctAnswers = 0;
  const categoryScores: { [key: string]: { correct: number; total: number } } = {};
  
  // Initialize category scores
  const categories = ["Data Structures & Algorithms", preferences.specialization];
  categories.forEach(category => {
    categoryScores[category] = { correct: 0, total: 0 };
  });

  answers.forEach((answer, index) => {
    if (index < questions.length) {
      const question = questions[index];
      const category = question.category;
      
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }
      
      categoryScores[category].total++;
      
      if (answer === question.correctAnswer) {
        correctAnswers++;
        categoryScores[category].correct++;
      }
    }
  });

  const totalQuestions = Math.min(answers.length, questions.length);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return {
    correctAnswers,
    totalQuestions,
    percentage,
    categoryScores
  };
};
