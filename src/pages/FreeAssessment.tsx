
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AssessmentWelcome from "@/components/assessment/AssessmentWelcome";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import AssessmentResults from "@/components/assessment/AssessmentResults";
import { getRandomQuestions } from "@/data/sampleQuestions";
import { AssessmentResults as ResultsType, CategoryScore, Question } from "@/types/assessmentTypes";

const FreeAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Generate random questions when assessment starts
  useEffect(() => {
    if (assessmentStarted && questions.length === 0) {
      const randomQuestions = getRandomQuestions(15);
      setQuestions(randomQuestions);
      console.log('Generated random questions:', randomQuestions.map(q => ({ category: q.category, question: q.question.substring(0, 50) + '...' })));
    }
  }, [assessmentStarted, questions.length]);

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
      
      if (currentQuestion < questions.length - 1) {
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

  const calculateResults = (): ResultsType => {
    let correctAnswers = 0;
    const categoryScores: { [key: string]: CategoryScore } = {};

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

    return { correctAnswers, totalQuestions, percentage, categoryScores };
  };

  const renderContent = () => {
    if (!assessmentStarted) {
      return <AssessmentWelcome onStart={handleStartAssessment} />;
    }

    if (showResults) {
      const results = calculateResults();
      return <AssessmentResults results={results} />;
    }

    // Show loading if questions haven't been generated yet
    if (questions.length === 0) {
      return (
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your personalized assessment...</p>
        </div>
      );
    }

    const question = questions[currentQuestion];
    return (
      <AssessmentQuestion
        question={question}
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        timeLeft={timeLeft}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        onFinish={handleFinishAssessment}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default FreeAssessment;
