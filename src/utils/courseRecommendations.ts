
import { UserPreferences } from "@/components/assessment/AssessmentPreferences";
import { AssessmentResults } from "@/types/assessmentTypes";

export const getRecommendedCourses = (
  preferences: UserPreferences,
  results: AssessmentResults
): string[] => {
  const { specialization } = preferences;
  const { percentage } = results;
  
  const courseRecommendations = {
    "Web Development": percentage >= 70 
      ? ["Advanced React Development", "Full Stack Architecture", "System Design for Web"]
      : percentage >= 50
      ? ["Complete Web Development Bootcamp", "React Fundamentals", "Backend Development"]
      : ["Web Development Fundamentals", "JavaScript Basics", "HTML/CSS Mastery"],
    "Data Science": percentage >= 70
      ? ["Advanced Machine Learning", "Deep Learning Specialization", "MLOps Engineering"]
      : percentage >= 50
      ? ["Data Science Bootcamp", "Machine Learning Fundamentals", "Python for Data Science"]
      : ["Python Programming", "Statistics for Data Science", "Data Analysis Basics"],
    "Cloud Computing": percentage >= 70
      ? ["AWS Solutions Architect", "Kubernetes Administration", "Cloud Security"]
      : percentage >= 50
      ? ["Cloud Computing Fundamentals", "AWS Developer", "DevOps Engineering"]
      : ["Introduction to Cloud", "AWS Basics", "Linux Fundamentals"]
  };
  
  return courseRecommendations[specialization as keyof typeof courseRecommendations] || [];
};
