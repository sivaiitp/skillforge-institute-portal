
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
import { Plus, Edit, Trash2, FileText, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <AdminSidebar />
      
      <div className="ml-64 pt-20">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Assessment Management</h1>
                <p className="text-gray-600">Add, edit, and remove online assessments</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Assessment
              </Button>
            </div>

            {showForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {editingAssessment ? 'Edit Assessment' : 'Add New Assessment'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Assessment Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="course_id">Course</Label>
                        <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course (optional)" />
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
                        <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                        <Input
                          id="duration_minutes"
                          type="number"
                          value={formData.duration_minutes}
                          onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                          placeholder="60"
                        />
                      </div>
                      <div>
                        <Label htmlFor="total_marks">Total Marks</Label>
                        <Input
                          id="total_marks"
                          type="number"
                          value={formData.total_marks}
                          onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                          placeholder="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="passing_marks">Passing Marks</Label>
                        <Input
                          id="passing_marks"
                          type="number"
                          value={formData.passing_marks}
                          onChange={(e) => setFormData({...formData, passing_marks: e.target.value})}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button type="submit">
                        {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowForm(false);
                        setEditingAssessment(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  All Assessments ({assessments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.title}</TableCell>
                        <TableCell>
                          {assessment.courses?.title || 'General'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {assessment.duration_minutes || 'N/A'} min
                          </div>
                        </TableCell>
                        <TableCell>
                          {assessment.passing_marks}/{assessment.total_marks}
                        </TableCell>
                        <TableCell>
                          <Badge variant={assessment.is_active ? 'default' : 'secondary'}>
                            {assessment.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(assessment)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(assessment.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AssessmentManagement;
