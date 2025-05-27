
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Download, Book, Target, Clock, Star } from "lucide-react";
import { AssessmentResults as ResultsType } from "@/types/assessmentTypes";
import { UserPreferences } from "./AssessmentPreferences";
import { useToast } from "@/hooks/use-toast";

interface PersonalizedResultsProps {
  results: ResultsType;
  preferences: UserPreferences;
}

const PersonalizedResults = ({ results, preferences }: PersonalizedResultsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const generatePersonalizedRoadmap = () => {
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

  const roadmap = generatePersonalizedRoadmap();

  const getRecommendedCourses = () => {
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

  const recommendedCourses = getRecommendedCourses();

  const downloadRoadmap = () => {
    const roadmapContent = `
PERSONALIZED LEARNING ROADMAP
${roadmap.specialization} | ${roadmap.difficultyLevel} Level

Assessment Score: ${results.percentage}% (${results.correctAnswers}/${results.totalQuestions} correct)
Timeline: ${roadmap.timeline}
Time Commitment: ${preferences.timeForInterview}

LEARNING PHASES:
${roadmap.phases.map((phase, index) => `
${index + 1}. ${phase.title} (${phase.duration})
   Skills: ${phase.skills.join(', ')}
`).join('')}

RECOMMENDED COURSES:
${recommendedCourses.map((course, index) => `${index + 1}. ${course}`).join('\n')}

CATEGORY BREAKDOWN:
${Object.entries(results.categoryScores).map(([category, scores]) => 
  `${category}: ${scores.correct}/${scores.total} (${Math.round((scores.correct/scores.total)*100)}%)`
).join('\n')}

Generated by TechEdu Learning Platform
Start your journey today!
    `;

    const blob = new Blob([roadmapContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.specialization.replace(/\s+/g, '_')}_Personalized_Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Roadmap Downloaded!",
      description: "Your personalized learning roadmap has been saved.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Personalized Results
        </h1>
        <p className="text-xl text-gray-600">Tailored for {preferences.specialization} • {roadmap.difficultyLevel} Level</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {results.percentage}%
              </div>
              <p className="text-gray-600 mb-4">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
              <Badge 
                variant={results.percentage >= 70 ? "default" : results.percentage >= 50 ? "secondary" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {results.percentage >= 70 ? "Strong" : results.percentage >= 50 ? "Good" : "Needs Focus"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Learning Plan</CardTitle>
            <CardDescription>Personalized timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              <span className="font-medium">Timeline: {roadmap.timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="text-purple-600" size={20} />
              <span className="font-medium">Level: {roadmap.difficultyLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-orange-600" size={20} />
              <span className="font-medium">Focus: {preferences.specialization}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Performance by topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(results.categoryScores).map(([category, scores]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm">{scores.correct}/{scores.total}</span>
                </div>
                <Progress value={(scores.correct / scores.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Personalized Learning Roadmap</CardTitle>
          <CardDescription>Customized for {preferences.specialization} with {preferences.timeForInterview} commitment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmap.phases.map((phase, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{phase.title}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Target size={16} />
                        Key Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
          <CardDescription>Based on your assessment results and goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {recommendedCourses.map((course, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="text-blue-600" size={20} />
                  <span className="font-medium">{course}</span>
                </div>
                <Badge 
                  variant={index === 0 ? "default" : "secondary"}
                  className={index === 0 ? "bg-green-600" : ""}
                >
                  {index === 0 ? "Recommended" : "Next Steps"}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={downloadRoadmap}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="mr-2" size={16} />
              Download Complete Roadmap
            </Button>
            <Button 
              onClick={() => navigate('/courses')}
              variant="outline"
              className="flex-1"
            >
              <Book className="mr-2" size={16} />
              Browse Courses
            </Button>
            <Button 
              onClick={() => navigate('/contact')}
              variant="secondary"
              className="flex-1"
            >
              Get Career Guidance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedResults;
