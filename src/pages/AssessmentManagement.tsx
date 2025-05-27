
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import QuestionManagement from '@/components/assessments/QuestionManagement';
import AssessmentManagementHeader from '@/components/assessments/AssessmentManagementHeader';
import AssessmentForm from '@/components/assessments/AssessmentForm';
import AssessmentTable from '@/components/assessments/AssessmentTable';

const AssessmentManagement = () => {
  const { userRole } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    duration_minutes: '',
    total_marks: '',
    passing_marks: '',
    is_active: true
  });

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAssessments();
      fetchCourses();
    }
  }, [userRole]);

  const fetchAssessments = async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        courses (title)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error fetching assessments');
      return;
    }
    setAssessments(data || []);
  };

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title')
      .eq('is_active', true)
      .order('title');
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const assessmentData = {
      ...formData,
      duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
      total_marks: formData.total_marks ? parseInt(formData.total_marks) : null,
      passing_marks: formData.passing_marks ? parseInt(formData.passing_marks) : null,
      course_id: formData.course_id || null
    };

    let error;
    if (editingAssessment) {
      ({ error } = await supabase
        .from('assessments')
        .update(assessmentData)
        .eq('id', editingAssessment.id));
    } else {
      ({ error } = await supabase
        .from('assessments')
        .insert([assessmentData]));
    }

    if (error) {
      toast.error(`Error ${editingAssessment ? 'updating' : 'creating'} assessment`);
      return;
    }

    toast.success(`Assessment ${editingAssessment ? 'updated' : 'created'} successfully!`);
    resetForm();
    fetchAssessments();
  };

  const handleEdit = (assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      title: assessment.title || '',
      description: assessment.description || '',
      course_id: assessment.course_id || '',
      duration_minutes: assessment.duration_minutes?.toString() || '',
      total_marks: assessment.total_marks?.toString() || '',
      passing_marks: assessment.passing_marks?.toString() || '',
      is_active: assessment.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (assessmentId) => {
    if (!confirm('Are you sure you want to delete this assessment? This will also delete all questions and attempts.')) return;

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId);

    if (error) {
      toast.error('Error deleting assessment');
      return;
    }

    toast.success('Assessment deleted successfully!');
    fetchAssessments();
  };

  const handleManageQuestions = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleAddAssessment = () => {
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAssessment(null);
    setFormData({
      title: '',
      description: '',
      course_id: '',
      duration_minutes: '',
      total_marks: '',
      passing_marks: '',
      is_active: true
    });
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

  if (selectedAssessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedAssessment(null)}
                className="mb-4"
              >
                ← Back to Assessments
              </Button>
            </div>
            <QuestionManagement 
              assessmentId={selectedAssessment.id} 
              assessmentTitle={selectedAssessment.title}
            />
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
          <AssessmentManagementHeader 
            assessmentsCount={assessments.length}
            activeAssessmentsCount={assessments.filter(a => a.is_active).length}
            coursesCount={courses.length}
            onAddAssessment={handleAddAssessment}
          />

          {showForm && (
            <AssessmentForm
              formData={formData}
              courses={courses}
              editingAssessment={editingAssessment}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              onFormDataChange={setFormData}
            />
          )}

          <AssessmentTable
            assessments={assessments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageQuestions={handleManageQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentManagement;
