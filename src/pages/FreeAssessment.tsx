import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft, User, UserCheck, Zap, Star } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
    correctAnswer: 0,
    category: "Web Development"
  },
  {
    id: 2,
    question: "Which of the following is a JavaScript framework?",
    options: ["Python", "React", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 3,
    question: "What is the primary purpose of CSS?",
    options: ["To add interactivity", "To style web pages", "To create databases", "To handle server requests"],
    correctAnswer: 1,
    category: "Web Development"
  },
  {
    id: 4,
    question: "Which language is primarily used for data science?",
    options: ["JavaScript", "Python", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Data Science"
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "System Query Language", "Standard Query Language"],
    correctAnswer: 0,
    category: "Database"
  },
  {
    id: 6,
    question: "Which of these is a cloud service provider?",
    options: ["React", "AWS", "HTML", "CSS"],
    correctAnswer: 1,
    category: "Cloud Computing"
  },
  {
    id: 7,
    question: "What is the main purpose of version control systems like Git?",
    options: ["To style websites", "To track code changes", "To host websites", "To write documentation"],
    correctAnswer: 1,
    category: "Development Tools"
  },
  {
    id: 8,
    question: "Which of these is a database management system?",
    options: ["React", "MySQL", "CSS", "HTML"],
    correctAnswer: 1,
    category: "Database"
  },
  {
    id: 9,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Automated Programming Interface", "Application Process Interface"],
    correctAnswer: 0,
    category: "Programming Concepts"
  },
  {
    id: 10,
    question: "Which methodology emphasizes iterative development?",
    options: ["Waterfall", "Agile", "Sequential", "Linear"],
    correctAnswer: 1,
    category: "Project Management"
  }
];

const FreeAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessmentType, setAssessmentType] = useState<'basic' | 'personalized' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  useEffect(() => {
    if (assessmentStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishAssessment();
    }
  }, [timeLeft, assessmentStarted, showResults]);

  const handleAssessmentTypeSelection = (type: 'basic' | 'personalized') => {
    if (type === 'personalized' && !user) {
      navigate('/auth');
      return;
    }
    
    setAssessmentType(type);
    if (type === 'personalized') {
      // Navigate to personalized assessment flow
      navigate('/personalized-assessment');
      return;
    }
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        handleFinishAssessment();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleFinishAssessment = () => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }
    setAnswers(finalAnswers);
    setShowResults(true);
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    const categoryScores: { [key: string]: { correct: number; total: number } } = {};

    answers.forEach((answer, index) => {
      if (index < sampleQuestions.length) {
        const question = sampleQuestions[index];
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

    const totalQuestions = Math.min(answers.length, sampleQuestions.length);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return { correctAnswers, totalQuestions, percentage, categoryScores };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRecommendedCourse = (percentage: number, categoryScores: any) => {
    if (percentage >= 80) {
      return "Advanced Full Stack Development";
    } else if (percentage >= 60) {
      return "Full Stack Web Development";
    } else if (percentage >= 40) {
      return "Web Development Fundamentals";
    } else {
      return "Programming Basics";
    }
  };

  // Assessment type selection screen
  if (!assessmentType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Assessment Path
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Select the assessment type that best fits your needs
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Basic Assessment Option */}
              <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-300" 
                    onClick={() => handleAssessmentTypeSelection('basic')}>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Quick Assessment</CardTitle>
                  <CardDescription className="text-lg">No signup required • 5 minutes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>10 general questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Basic skill assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>General course recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Instant results</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    Start Quick Assessment
                  </Button>
                </CardContent>
              </Card>

              {/* Personalized Assessment Option */}
              <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-purple-300 relative" 
                    onClick={() => handleAssessmentTypeSelection('personalized')}>
                <div className="absolute -top-3 -right-3">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Recommended
                  </Badge>
                </div>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Personalized Path</CardTitle>
                  <CardDescription className="text-lg">
                    {user ? "Enhanced assessment • 10-15 minutes" : "Requires login • 10-15 minutes"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Career-focused questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Custom learning roadmap</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Progress tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Timeline estimation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Company-specific guidance</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    {user ? "Start Personalized Assessment" : "Login & Start Assessment"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Not sure which to choose? Start with the quick assessment and upgrade anytime.
              </p>
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Both assessments provide valuable insights into your learning path</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Basic assessment flow continues with existing code
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quick Skill Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover your current skill level and get course recommendations
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
                <CardDescription>What to expect from this assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Number of Questions:</span>
                  <Badge variant="secondary">10 Questions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Limit:</span>
                  <Badge variant="secondary">5 Minutes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Topics Covered:</span>
                  <Badge variant="secondary">Web Dev, Data Science, Cloud</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Difficulty Level:</span>
                  <Badge variant="secondary">Beginner to Intermediate</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => setAssessmentType(null)}
              >
                Back to Options
              </Button>
              <Button 
                size="lg" 
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const results = calculateResults();
    const recommendedCourse = getRecommendedCourse(results.percentage, results.categoryScores);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Assessment Results
              </h1>
              <p className="text-xl text-gray-600">Here's how you performed</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
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
                      {results.percentage >= 70 ? "Excellent" : results.percentage >= 50 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Performance by topic area</CardDescription>
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

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
                <CardDescription>Based on your assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Recommended Course:</h4>
                    <p className="text-blue-800 text-lg font-medium">{recommendedCourse}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Want a Personalized Learning Path?
                    </h4>
                    <p className="text-purple-800 mb-3">
                      Get a custom roadmap tailored to your career goals, experience level, and timeline.
                    </p>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {user ? "Create Personalized Path" : "Sign Up for Personalized Path"}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => navigate('/courses')}
                      className="flex-1"
                    >
                      Browse Courses
                    </Button>
                    <Button 
                      onClick={() => navigate('/contact')}
                      variant="outline"
                      className="flex-1"
                    >
                      Get Career Guidance
                    </Button>
                    <Button 
                      onClick={() => setAssessmentType(null)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Take Another Assessment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Question display (existing code)
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const question = sampleQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Quick Skill Assessment</h1>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5" />
                <span className={timeLeft < 60 ? "text-red-600" : "text-gray-700"}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </p>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{question.question}</CardTitle>
                <Badge variant="outline">{question.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentQuestion === sampleQuestions.length - 1 ? (
                <Button
                  onClick={handleFinishAssessment}
                  disabled={selectedAnswer === null}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finish Assessment
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeAssessment;
