
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
}

interface AssessmentStartScreenProps {
  assessment: Assessment;
  totalQuestions: number;
  onStartAssessment: () => void;
}

const AssessmentStartScreen = ({ assessment, totalQuestions, onStartAssessment }: AssessmentStartScreenProps) => {
  return (
    <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="text-center pb-8 pt-10">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{assessment.title}</CardTitle>
        {assessment.description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{assessment.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-8 px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg">Duration</p>
            <p className="text-gray-600 mt-1">{assessment.duration_minutes} minutes</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg">Questions</p>
            <p className="text-gray-600 mt-1">{totalQuestions} questions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg">Passing Score</p>
            <p className="text-gray-600 mt-1">{assessment.passing_marks}/{assessment.total_marks}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            Assessment Instructions
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>You have {assessment.duration_minutes} minutes to complete this assessment</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>You can navigate between questions using the navigation buttons</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Make sure to answer all questions before submitting</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>The assessment will auto-submit when time expires</span>
            </li>
          </ul>
        </div>

        <Button 
          onClick={onStartAssessment}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Start Assessment
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentStartScreen;
