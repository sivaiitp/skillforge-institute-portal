
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import QuestionForm from '@/components/assessments/QuestionForm';
import QuestionImporter from '@/components/assessments/QuestionImporter';
import QuestionsList from '@/components/assessments/QuestionsList';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';

interface Course {
  id: string;
  title: string;
}

interface Assessment {
  id: string;
  title: string;
}

const QuestionManagementSystem = () => {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [selectedAssessmentTitle, setSelectedAssessmentTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState('single');

  const {
    questions,
    loading,
    editingQuestion,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    fetchQuestions
  } = useQuestionManagement(selectedAssessmentId);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCourses();
    }
  }, [userRole]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchAssessments(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast.error('Error fetching courses');
      console.error('Error:', error);
    }
  };

  const fetchAssessments = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('id, title')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      setAssessments(data || []);
      setSelectedAssessmentId('');
      setSelectedAssessmentTitle('');
    } catch (error) {
      toast.error('Error fetching assessments');
      console.error('Error:', error);
    }
  };

  const handleAssessmentChange = (assessmentId: string) => {
    const assessment = assessments.find(a => a.id === assessmentId);
    setSelectedAssessmentId(assessmentId);
    setSelectedAssessmentTitle(assessment?.title || '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      setActiveTab('questions');
    }
  };

  const handleEditQuestion = (question: any) => {
    handleEdit(question);
    setActiveTab('single');
  };

  const handleImportComplete = () => {
    fetchQuestions();
    setActiveTab('questions');
  };

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
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Question Management System</h1>
            
            {/* Course and Assessment Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course">Select Course</Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assessment">Select Assessment</Label>
                <Select 
                  value={selectedAssessmentId} 
                  onValueChange={handleAssessmentChange}
                  disabled={!selectedCourseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessments.map((assessment) => (
                      <SelectItem key={assessment.id} value={assessment.id}>
                        {assessment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Question Management Tabs */}
          {selectedAssessmentId && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger value="single" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Single Question
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Bulk Upload
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="flex items-center gap-2">
                    Questions List
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Single Question
                        {editingQuestion && (
                          <span className="text-sm text-blue-600 font-normal">
                            - Editing: {editingQuestion.question_text.substring(0, 30)}...
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QuestionForm
                        editingQuestion={editingQuestion}
                        formData={formData}
                        loading={loading}
                        onSubmit={handleFormSubmit}
                        onCancel={resetForm}
                        onFormDataChange={setFormData}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bulk" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Bulk Question Upload
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QuestionImporter
                        assessmentId={selectedAssessmentId}
                        onImportComplete={handleImportComplete}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Questions for: {selectedAssessmentTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QuestionsList
                        questions={questions}
                        loading={loading}
                        onEdit={handleEditQuestion}
                        onDelete={handleDelete}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManagementSystem;
