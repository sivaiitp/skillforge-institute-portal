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

  const downloadRoadmapAsPDF = () => {
    // Create a new window for the PDF
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Please allow popups to download the PDF",
        variant: "destructive"
      });
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Personalized Learning Roadmap - ${preferences.specialization}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap');
          
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
            color: #1f2937;
            line-height: 1.6;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            padding: 32px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          
          .institute-info {
            position: relative;
            z-index: 2;
            margin-bottom: 24px;
          }
          
          .institute-name {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 8px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          
          .institute-tagline {
            font-size: 16px;
            opacity: 0.9;
            margin: 0 0 16px 0;
            font-weight: 300;
          }
          
          .institute-address {
            font-size: 14px;
            opacity: 0.8;
            margin: 0;
            font-weight: 400;
          }
          
          .document-title {
            position: relative;
            z-index: 2;
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            font-weight: 700;
            margin: 24px 0 0 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          }
          
          .content {
            padding: 40px;
          }
          
          .assessment-summary {
            background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            border: 1px solid #93c5fd;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 24px;
            margin-bottom: 20px;
          }
          
          .summary-item {
            text-align: center;
          }
          
          .summary-value {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            margin: 0 0 4px 0;
          }
          
          .summary-label {
            font-size: 14px;
            color: #6b7280;
            margin: 0;
            font-weight: 500;
          }
          
          .user-details {
            background: #f9fafb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }
          
          .user-details h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            font-size: 14px;
          }
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .detail-label {
            font-weight: 500;
            color: #6b7280;
          }
          
          .detail-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          .section {
            margin: 32px 0;
          }
          
          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 0 0 20px 0;
            padding-bottom: 8px;
            border-bottom: 3px solid #2563eb;
            display: inline-block;
          }
          
          .roadmap-phase {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            position: relative;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          
          .phase-number {
            position: absolute;
            top: -12px;
            left: 24px;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
          }
          
          .phase-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .phase-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }
          
          .phase-duration {
            background: #dbeafe;
            color: #2563eb;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
            margin-top: 12px;
          }
          
          .skill-tag {
            background: #f0f9ff;
            color: #1e40af;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #bfdbfe;
            text-align: center;
          }
          
          .courses-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-top: 16px;
          }
          
          .course-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            position: relative;
          }
          
          .course-title {
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 8px 0;
            font-size: 14px;
          }
          
          .course-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #10b981;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
          }
          
          .category-breakdown {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .category-name {
            font-weight: 500;
            color: #374151;
          }
          
          .category-score {
            font-weight: 600;
            color: #2563eb;
          }
          
          .footer {
            background: #f9fafb;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            margin-top: 40px;
          }
          
          .footer-text {
            font-size: 12px;
            color: #6b7280;
            margin: 4px 0;
          }
          
          .generated-date {
            font-weight: 500;
            color: #374151;
          }
          
          @media print {
            body { 
              background: white; 
              padding: 0; 
            }
            .container { 
              box-shadow: none; 
              max-width: none;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="institute-info">
              <h1 class="institute-name">RaceCoding Institute</h1>
              <p class="institute-tagline">Excellence in Digital Education & Professional Development</p>
              <div class="institute-address">
                123 Tech Innovation Hub, Silicon Valley Road, Digital City, TC 560001<br>
                Phone: +91-9876543210 | Email: info@racecoding.com | Web: www.racecoding.com
              </div>
            </div>
            <h2 class="document-title">Personalized Learning Roadmap</h2>
          </div>
          
          <div class="content">
            <div class="assessment-summary">
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-value">${results.percentage}%</div>
                  <div class="summary-label">Overall Score</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${results.correctAnswers}/${results.totalQuestions}</div>
                  <div class="summary-label">Questions Correct</div>
                </div>
                <div class="summary-item">
                  <div class="summary-value">${roadmap.timeline}</div>
                  <div class="summary-label">Recommended Timeline</div>
                </div>
              </div>
              
              <div class="user-details">
                <h3>Assessment Details</h3>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Specialization:</span>
                    <span class="detail-value">${preferences.specialization}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Experience Level:</span>
                    <span class="detail-value">${preferences.experience}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Time Commitment:</span>
                    <span class="detail-value">${preferences.timeForInterview}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Difficulty Level:</span>
                    <span class="detail-value">${roadmap.difficultyLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Learning Roadmap</h2>
              ${roadmap.phases.map((phase, index) => `
                <div class="roadmap-phase">
                  <div class="phase-number">${index + 1}</div>
                  <div class="phase-header">
                    <h3 class="phase-title">${phase.title}</h3>
                    <span class="phase-duration">${phase.duration}</span>
                  </div>
                  <div class="skills-grid">
                    ${phase.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2 class="section-title">Recommended Courses</h2>
              <div class="courses-grid">
                ${recommendedCourses.map((course, index) => `
                  <div class="course-card">
                    ${index === 0 ? '<div class="course-badge">Recommended</div>' : ''}
                    <h4 class="course-title">${course}</h4>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Performance Breakdown</h2>
              <div class="category-breakdown">
                ${Object.entries(results.categoryScores).map(([category, scores]) => `
                  <div class="category-item">
                    <span class="category-name">${category}</span>
                    <span class="category-score">${scores.correct}/${scores.total} (${Math.round((scores.correct/scores.total)*100)}%)</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text generated-date">Generated on ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p class="footer-text">This personalized roadmap is designed to guide your learning journey.</p>
            <p class="footer-text">For support and guidance, contact us at support@racecoding.com</p>
            <p class="footer-text">© 2024 RaceCoding Institute. All rights reserved.</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast({
      title: "PDF Generation Started",
      description: "Your personalized roadmap PDF is being prepared for download.",
    });
  };

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
              onClick={downloadRoadmapAsPDF}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="mr-2" size={16} />
              Download PDF Roadmap
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
