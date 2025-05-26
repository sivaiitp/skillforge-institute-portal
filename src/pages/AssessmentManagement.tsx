import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, Clock, GraduationCap, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AdminSidebar from '@/components/AdminSidebar';

const AssessmentManagement = () => {
  const { userRole } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
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
    if (!confirm('Are you sure you want to delete this assessment?')) return;

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

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <AdminSidebar />
        <div className="ml-64 pt-20 p-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <AdminSidebar />
      
      <div className="ml-64 pt-20">
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Assessment Management</h1>
                      <p className="text-gray-300">Create and manage online assessments</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowForm(true)} 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Assessment
                  </Button>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-200 text-sm">Total Assessments</p>
                        <p className="text-2xl font-bold text-white">{assessments.length}</p>
                      </div>
                      <FileText className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-200 text-sm">Active Assessments</p>
                        <p className="text-2xl font-bold text-white">{assessments.filter(a => a.is_active).length}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm">Linked Courses</p>
                        <p className="text-2xl font-bold text-white">{courses.length}</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            {showForm && (
              <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingAssessment ? 'Edit Assessment' : 'Add New Assessment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-200">Assessment Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-400/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course_id" className="text-gray-200">Course</Label>
                        <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/15 focus:border-orange-400/50">
                            <SelectValue placeholder="Select course (optional)" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id} className="text-white hover:bg-white/10">
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration_minutes" className="text-gray-200">Duration (minutes)</Label>
                        <Input
                          id="duration_minutes"
                          type="number"
                          value={formData.duration_minutes}
                          onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                          placeholder="60"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-400/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="total_marks" className="text-gray-200">Total Marks</Label>
                        <Input
                          id="total_marks"
                          type="number"
                          value={formData.total_marks}
                          onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                          placeholder="100"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-400/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="passing_marks" className="text-gray-200">Passing Marks</Label>
                        <Input
                          id="passing_marks"
                          type="number"
                          value={formData.passing_marks}
                          onChange={(e) => setFormData({...formData, passing_marks: e.target.value})}
                          placeholder="60"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-400/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-gray-200">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-400/50"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowForm(false);
                        setEditingAssessment(null);
                      }} className="border-white/20 text-white hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Assessments Table */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  All Assessments ({assessments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20 hover:bg-white/5">
                        <TableHead className="text-gray-200">Title</TableHead>
                        <TableHead className="text-gray-200">Course</TableHead>
                        <TableHead className="text-gray-200">Duration</TableHead>
                        <TableHead className="text-gray-200">Marks</TableHead>
                        <TableHead className="text-gray-200">Status</TableHead>
                        <TableHead className="text-gray-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((assessment) => (
                        <TableRow key={assessment.id} className="border-white/20 hover:bg-white/5 transition-colors">
                          <TableCell className="font-medium text-white">{assessment.title}</TableCell>
                          <TableCell className="text-gray-300">
                            {assessment.courses?.title || 'General'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4 text-orange-400" />
                              {assessment.duration_minutes || 'N/A'} min
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {assessment.passing_marks}/{assessment.total_marks}
                          </TableCell>
                          <TableCell>
                            <Badge variant={assessment.is_active ? 'default' : 'secondary'} 
                                   className={assessment.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                              {assessment.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(assessment)}
                                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(assessment.id)}
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssessmentManagement;
