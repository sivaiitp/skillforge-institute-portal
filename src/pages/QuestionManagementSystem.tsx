
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { HelpCircle, Upload, Download, Plus, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const QuestionManagementSystem = () => {
  const { userRole } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1
  });

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAssessments();
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedAssessment) {
      fetchQuestions();
    }
  }, [selectedAssessment]);

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      toast.error('Error fetching assessments');
      console.error('Error:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', selectedAssessment)
        .order('sort_order');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      toast.error('Error fetching questions');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    if (!selectedAssessment) {
      toast.error('Please select an assessment first');
      return;
    }

    try {
      setLoading(true);
      const questionData = {
        assessment_id: selectedAssessment,
        question_text: formData.question_text,
        question_type: formData.question_type,
        options: formData.question_type === 'multiple_choice' ? formData.options : null,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation || null,
        points: formData.points,
        sort_order: questions.length
      };

      const { error } = await supabase
        .from('assessment_questions')
        .insert([questionData]);

      if (error) throw error;

      toast.success('Question added successfully!');
      setFormData({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        points: 1
      });
      setShowAddForm(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error adding question');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile || !selectedAssessment) {
      toast.error('Please select an assessment and CSV file');
      return;
    }

    try {
      setLoading(true);
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Expected CSV format: question_text,question_type,option1,option2,option3,option4,correct_answer,explanation,points
      const questions = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 9) {
          const questionData = {
            assessment_id: selectedAssessment,
            question_text: values[0],
            question_type: values[1] || 'multiple_choice',
            options: values[1] === 'multiple_choice' ? [values[2], values[3], values[4], values[5]] : null,
            correct_answer: values[6],
            explanation: values[7] || null,
            points: parseInt(values[8]) || 1,
            sort_order: i - 1
          };
          questions.push(questionData);
        }
      }

      if (questions.length > 0) {
        const { error } = await supabase
          .from('assessment_questions')
          .insert(questions);

        if (error) throw error;

        toast.success(`Successfully uploaded ${questions.length} questions!`);
        setCsvFile(null);
        fetchQuestions();
      } else {
        toast.error('No valid questions found in CSV file');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error uploading CSV file');
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = [
      'question_text,question_type,option1,option2,option3,option4,correct_answer,explanation,points',
      'What is 2+2?,multiple_choice,3,4,5,6,4,Basic addition,1',
      'What is the capital of France?,multiple_choice,London,Berlin,Paris,Rome,Paris,Geography question,2'
    ];
    
    const blob = new Blob([sampleData.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredQuestions = questions.filter(q => 
    q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Question Management System</h1>
                    <p className="text-gray-600">Manage assessment questions and upload question banks</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>
            </div>
          </div>

          {/* Assessment Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Assessment</CardTitle>
              <CardDescription>Choose an assessment to manage its questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id}>
                      {assessment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* CSV Upload Section */}
          {selectedAssessment && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Upload Questions
                </CardTitle>
                <CardDescription>Upload questions from a CSV file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button 
                    onClick={handleCsvUpload} 
                    disabled={!csvFile || loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={downloadSampleCsv}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Sample CSV
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Add Question Form */}
          {showAddForm && selectedAssessment && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div>
                    <Label htmlFor="question_text">Question Text</Label>
                    <Textarea
                      id="question_text"
                      value={formData.question_text}
                      onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="question_type">Question Type</Label>
                    <Select 
                      value={formData.question_type} 
                      onValueChange={(value) => setFormData({...formData, question_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.question_type === 'multiple_choice' && (
                    <div className="grid grid-cols-2 gap-4">
                      {formData.options.map((option, index) => (
                        <div key={index}>
                          <Label htmlFor={`option_${index}`}>Option {index + 1}</Label>
                          <Input
                            id={`option_${index}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...formData.options];
                              newOptions[index] = e.target.value;
                              setFormData({...formData, options: newOptions});
                            }}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="correct_answer">Correct Answer</Label>
                    <Input
                      id="correct_answer"
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      value={formData.explanation}
                      onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 1})}
                      min="1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      Add Question
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Questions List */}
          {selectedAssessment && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
                    <CardDescription>Manage questions for the selected assessment</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading questions...</div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No questions found. Add some questions to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">
                            Q{index + 1}: {question.question_text}
                          </h3>
                          <span className="text-sm text-gray-500">{question.points} points</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Type: {question.question_type}</p>
                        {question.options && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Options:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {question.options.map((option, idx) => (
                                <li key={idx} className={option === question.correct_answer ? 'text-green-600 font-medium' : ''}>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="text-sm text-green-600">Correct Answer: {question.correct_answer}</p>
                        {question.explanation && (
                          <p className="text-sm text-gray-600 mt-2">Explanation: {question.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementSystem;
