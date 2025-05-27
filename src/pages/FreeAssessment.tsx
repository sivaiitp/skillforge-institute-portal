
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft } from "lucide-react";

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
  },
  {
    id: 11,
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    category: "Data Structures & Algorithms"
  },
  {
    id: 12,
    question: "Which data structure follows the Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
    category: "Data Structures & Algorithms"
  },
  {
    id: 13,
    question: "What is the worst-case time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  },
  {
    id: 14,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Both Quick Sort and Merge Sort"],
    correctAnswer: 3,
    category: "Data Structures & Algorithms"
  },
  {
    id: 15,
    question: "Which data structure is most suitable for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    category: "Data Structures & Algorithms"
  }
];

const FreeAssessment = () => {
  const navigate = useNavigate();
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

  if (!assessmentStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Free Skill Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover your current skill level and get personalized course recommendations
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Assessment Details</CardTitle>
                <CardDescription>What to expect from this assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Number of Questions:</span>
                  <Badge variant="secondary">15 Questions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Limit:</span>
                  <Badge variant="secondary">5 Minutes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Topics Covered:</span>
                  <Badge variant="secondary">Web Dev, Data Science, Cloud, DSA</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Difficulty Level:</span>
                  <Badge variant="secondary">Beginner to Intermediate</Badge>
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Assessment
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                      onClick={() => navigate('/auth')}
                      variant="secondary"
                      className="flex-1"
                    >
                      Create Account
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
              <h1 className="text-2xl font-bold">Skill Assessment</h1>
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
