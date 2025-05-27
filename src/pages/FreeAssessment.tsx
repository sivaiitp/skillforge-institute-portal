
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AssessmentPreferences, { UserPreferences } from "@/components/assessment/AssessmentPreferences";
import AssessmentQuestion from "@/components/assessment/AssessmentQuestion";
import PersonalizedResults from "@/components/assessment/PersonalizedResults";
import { generateCustomizedQuestions, calculatePersonalizedScore } from "@/utils/questionCuration";
import { Question } from "@/types/assessmentTypes";

const FreeAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for personalized assessment
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [preferencesSet, setPreferencesSet] = useState(false);

  // Generate customized questions when preferences are set
  useEffect(() => {
    if (userPreferences && !assessmentStarted && questions.length === 0) {
      const customizedQuestions = generateCustomizedQuestions(userPreferences);
      setQuestions(customizedQuestions);
      console.log('Generated customized questions:', customizedQuestions.map(q => ({ 
        category: q.category, 
        question: q.question.substring(0, 50) + '...' 
      })));
    }
  }, [userPreferences, assessmentStarted, questions.length]);

  // Timer logic
  useEffect(() => {
    if (assessmentStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishAssessment();
    }
  }, [timeLeft, assessmentStarted, showResults]);

  const handlePreferencesSubmit = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setPreferencesSet(true);
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

  const calculateResults = () => {
    if (!userPreferences) return { correctAnswers: 0, totalQuestions: 0, percentage: 0, categoryScores: {} };
    
    return calculatePersonalizedScore(answers, questions, userPreferences);
  };

  const renderContent = () => {
    if (!preferencesSet) {
      return <AssessmentPreferences onStart={handlePreferencesSubmit} />;
    }

    if (!assessmentStarted) {
      // Show personalized welcome screen
      return (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready for Your Personalized Assessment?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We've customized 20 questions for your {userPreferences?.specialization} journey
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Your Assessment Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div><strong>Specialization:</strong> {userPreferences?.specialization}</div>
              <div><strong>Experience:</strong> {userPreferences?.experience}</div>
              <div><strong>Time Commitment:</strong> {userPreferences?.timeForInterview}</div>
              <div><strong>Questions:</strong> 10 DSA + 10 {userPreferences?.specialization}</div>
              <div><strong>Duration:</strong> 10 minutes</div>
              <div><strong>Result:</strong> Personalized roadmap & course recommendations</div>
            </div>
          </div>

          <button 
            onClick={handleStartAssessment}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg text-lg transition-all"
          >
            Start My Assessment
          </button>
        </div>
      );
    }

    if (showResults) {
      const results = calculateResults();
      return <PersonalizedResults results={results} preferences={userPreferences!} />;
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
