
import { UserPreferences } from "@/components/assessment/AssessmentPreferences";
import { AssessmentResults } from "@/types/assessmentTypes";

export interface RoadmapPhase {
  title: string;
  duration: string;
  skills: string[];
}

export interface PersonalizedRoadmap {
  specialization: string;
  timeline: string;
  difficultyLevel: string;
  phases: RoadmapPhase[];
}

export const generatePersonalizedRoadmap = (
  preferences: UserPreferences,
  results: AssessmentResults
): PersonalizedRoadmap => {
  const { specialization, experience, timeForInterview } = preferences;
  const { percentage } = results;
  
  // Determine difficulty level based on experience and performance
  const getDifficultyLevel = () => {
    if (experience === "beginner" || percentage < 50) return "Foundation";
    if (experience === "intermediate" || percentage < 75) return "Intermediate";
    return "Advanced";
  };

  // Generate timeline based on time commitment
  const getTimeline = () => {
    const timeMap = {
      "1-2 hours/week": "6-8 months",
      "3-5 hours/week": "4-6 months", 
      "6-10 hours/week": "3-4 months",
      "10+ hours/week": "2-3 months"
    };
    return timeMap[timeForInterview as keyof typeof timeMap] || "4-6 months";
  };

  const difficultyLevel = getDifficultyLevel();
  const timeline = getTimeline();

  // Specialized roadmaps based on area of interest
  const roadmaps = {
    "Web Development": {
      phases: [
        {
          title: `${difficultyLevel} Web Technologies`,
          duration: "25% of timeline",
          skills: difficultyLevel === "Foundation" 
            ? ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"]
            : difficultyLevel === "Intermediate"
            ? ["React/Vue", "State Management", "API Integration", "Testing"]
            : ["Advanced React Patterns", "Performance Optimization", "Micro-frontends", "PWAs"]
        },
        {
          title: "Backend Development",
          duration: "25% of timeline", 
          skills: difficultyLevel === "Foundation"
            ? ["Node.js Basics", "Express.js", "REST APIs", "Database Basics"]
            : difficultyLevel === "Intermediate"
            ? ["Advanced Node.js", "GraphQL", "Authentication", "Database Design"]
            : ["Microservices", "System Design", "Performance Tuning", "Security"]
        },
        {
          title: "Data Structures & Algorithms",
          duration: "30% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Arrays & Strings", "Basic Sorting", "Time Complexity", "Problem Solving"]
            : difficultyLevel === "Intermediate" 
            ? ["Trees & Graphs", "Dynamic Programming", "Advanced Algorithms", "System Design Basics"]
            : ["Advanced Data Structures", "Complex Algorithms", "System Design", "Optimization"]
        },
        {
          title: "Professional Skills",
          duration: "20% of timeline",
          skills: ["Git/Version Control", "CI/CD", "Testing", "Documentation", "Interview Prep"]
        }
      ]
    },
    "Data Science": {
      phases: [
        {
          title: `${difficultyLevel} Data Science`,
          duration: "30% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Python Basics", "Pandas", "NumPy", "Data Visualization"]
            : difficultyLevel === "Intermediate"
            ? ["Advanced Python", "Statistical Analysis", "Feature Engineering", "Model Selection"]
            : ["Advanced ML", "Deep Learning", "MLOps", "Production Systems"]
        },
        {
          title: "Machine Learning",
          duration: "25% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Scikit-learn"]
            : difficultyLevel === "Intermediate"
            ? ["Ensemble Methods", "Time Series", "NLP Basics", "Computer Vision Basics"]
            : ["Advanced NLP", "Advanced Computer Vision", "Reinforcement Learning", "Research"]
        },
        {
          title: "Data Structures & Algorithms",
          duration: "25% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Basic DSA", "Python Data Structures", "Algorithm Basics", "Problem Solving"]
            : difficultyLevel === "Intermediate"
            ? ["Advanced DSA", "Optimization", "Graph Algorithms", "Dynamic Programming"]
            : ["Complex Algorithms", "System Design for ML", "Distributed Systems", "Performance"]
        },
        {
          title: "Tools & Deployment",
          duration: "20% of timeline",
          skills: ["SQL", "Cloud Platforms", "Docker", "Model Deployment", "Interview Prep"]
        }
      ]
    },
    "Cloud Computing": {
      phases: [
        {
          title: `${difficultyLevel} Cloud Fundamentals`,
          duration: "25% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Cloud Basics", "AWS Core Services", "Networking", "Security Basics"]
            : difficultyLevel === "Intermediate"
            ? ["Multi-cloud", "Advanced Networking", "Identity Management", "Cost Optimization"]
            : ["Enterprise Architecture", "Cloud Strategy", "Governance", "Innovation"]
        },
        {
          title: "Infrastructure & DevOps",
          duration: "25% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["IaC Basics", "Docker", "CI/CD Basics", "Monitoring"]
            : difficultyLevel === "Intermediate"
            ? ["Kubernetes", "Advanced IaC", "Advanced CI/CD", "Observability"]
            : ["Service Mesh", "GitOps", "Advanced Kubernetes", "Platform Engineering"]
        },
        {
          title: "Data Structures & Algorithms",
          duration: "30% of timeline",
          skills: difficultyLevel === "Foundation"
            ? ["Basic DSA", "System Design Basics", "Distributed Systems Basics", "Problem Solving"]
            : difficultyLevel === "Intermediate"
            ? ["Advanced DSA", "System Design", "Distributed Algorithms", "Performance"]
            : ["Complex System Design", "Distributed Systems", "Scalability", "Reliability"]
        },
        {
          title: "Specialization",
          duration: "20% of timeline",
          skills: ["Serverless", "Data Engineering", "ML on Cloud", "Interview Prep"]
        }
      ]
    }
  };

  return {
    specialization,
    timeline,
    difficultyLevel,
    phases: roadmaps[specialization as keyof typeof roadmaps]?.phases || []
  };
};
