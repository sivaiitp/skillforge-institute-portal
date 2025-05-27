
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Question } from "@/types/assessmentTypes";

interface AssessmentQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  timeLeft: number;
  onAnswerSelect: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

const AssessmentQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  timeLeft,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFinish
}: AssessmentQuestionProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
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
          Question {currentQuestion + 1} of {totalQuestions}
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
                onClick={() => onAnswerSelect(index)}
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
          onClick={onPrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {currentQuestion === totalQuestions - 1 ? (
            <Button
              onClick={onFinish}
              disabled={selectedAnswer === null}
              className="bg-green-600 hover:bg-green-700"
            >
              Finish Assessment
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={selectedAnswer === null}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestion;
