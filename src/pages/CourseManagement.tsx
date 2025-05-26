
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
import { Plus, Edit, Trash2, BookOpen, Upload } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

const CourseManagement = () => {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: '',
    category: '',
    price: '',
    certification: '',
    image_url: '',
    brochure_url: '',
    detailed_description: '',
    prerequisites: '',
    learning_outcomes: '',
    is_featured: false,
    is_active: true
  });

  const courseCategories = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'Database Management',
    'UI/UX Design',
    'Digital Marketing',
    'Project Management'
  ];

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCourses();
    }
  }, [userRole]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null
    };

    let error;
    if (editingCourse) {
      ({ error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id));
    } else {
      ({ error } = await supabase
        .from('courses')
        .insert([courseData]));
    }

    if (error) {
      toast.error(`Error ${editingCourse ? 'updating' : 'creating'} course`);
      return;
    }

    toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully!`);
    setShowForm(false);
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      duration: '',
      level: '',
      category: '',
      price: '',
      certification: '',
      image_url: '',
      brochure_url: '',
      detailed_description: '',
      prerequisites: '',
      learning_outcomes: '',
      is_featured: false,
      is_active: true
    });
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      level: course.level || '',
      category: course.category || '',
      price: course.price?.toString() || '',
      certification: course.certification || '',
      image_url: course.image_url || '',
      brochure_url: course.brochure_url || '',
      detailed_description: course.detailed_description || '',
      prerequisites: course.prerequisites || '',
      learning_outcomes: course.learning_outcomes || '',
      is_featured: course.is_featured || false,
      is_active: course.is_active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      toast.error('Error deleting course');
      return;
    }

    toast.success('Course deleted successfully!');
    fetchCourses();
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div>Access denied</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-600">Add, edit, and remove courses</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Course
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 8 weeks"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="certification">Certification</Label>
                    <Input
                      id="certification"
                      value={formData.certification}
                      onChange={(e) => setFormData({...formData, certification: e.target.value})}
                      placeholder="Certificate name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Hero Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brochure_url">Brochure PDF URL</Label>
                    <Input
                      id="brochure_url"
                      value={formData.brochure_url}
                      onChange={(e) => setFormData({...formData, brochure_url: e.target.value})}
                      placeholder="https://example.com/brochure.pdf"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    placeholder="Brief course overview for cards and listings"
                  />
                </div>

                <div>
                  <Label htmlFor="detailed_description">Detailed Description</Label>
                  <Textarea
                    id="detailed_description"
                    value={formData.detailed_description}
                    onChange={(e) => setFormData({...formData, detailed_description: e.target.value})}
                    rows={4}
                    placeholder="Comprehensive course description for the details page"
                  />
                </div>

                <div>
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea
                    id="prerequisites"
                    value={formData.prerequisites}
                    onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                    rows={2}
                    placeholder="What students need to know before taking this course"
                  />
                </div>

                <div>
                  <Label htmlFor="learning_outcomes">Learning Outcomes</Label>
                  <Textarea
                    id="learning_outcomes"
                    value={formData.learning_outcomes}
                    onChange={(e) => setFormData({...formData, learning_outcomes: e.target.value})}
                    rows={3}
                    placeholder="What students will learn (one per line)"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    Featured Course
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
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
              <BookOpen className="w-5 h-5" />
              All Courses ({courses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.category || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.level || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{course.duration || 'N/A'}</TableCell>
                    <TableCell>
                      {course.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.is_active ? 'default' : 'secondary'}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
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
    </div>
  );
};

export default CourseManagement;
