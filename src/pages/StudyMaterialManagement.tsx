
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, Video, Music, Image, Presentation, ExternalLink, BookOpen } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  file_extension: string;
  duration: string;
  is_downloadable: boolean;
  sort_order: number;
  is_active: boolean;
  course_id: string;
  courses: {
    title: string;
    category: string;
  };
}

interface Course {
  id: string;
  title: string;
  category: string;
}

const StudyMaterialManagement = () => {
  const { userRole } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    material_type: 'pdf',
    file_url: '',
    file_size: 0,
    mime_type: '',
    file_extension: '',
    duration: '',
    is_downloadable: true,
    sort_order: 0,
    is_active: true
  });

  const materialTypes = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'audio', label: 'Audio', icon: Music },
    { value: 'presentation', label: 'Presentation', icon: Presentation },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'link', label: 'External Link', icon: ExternalLink }
  ];

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCourses();
      fetchMaterials();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchMaterials();
    }
  }, [selectedCourse, userRole]);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, category')
      .eq('is_active', true)
      .order('title');
    
    if (error) {
      toast.error('Error fetching courses');
      return;
    }
    setCourses(data || []);
  };

  const fetchMaterials = async () => {
    let query = supabase
      .from('study_materials')
      .select(`
        *,
        courses (
          title,
          category
        )
      `)
      .order('sort_order', { ascending: true });

    if (selectedCourse !== 'all') {
      query = query.eq('course_id', selectedCourse);
    }

    const { data, error } = await query;
    
    if (error) {
      toast.error('Error fetching study materials');
      return;
    }
    setMaterials(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.course_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    let error;
    if (editingMaterial) {
      ({ error } = await supabase
        .from('study_materials')
        .update(formData)
        .eq('id', editingMaterial.id));
    } else {
      ({ error } = await supabase
        .from('study_materials')
        .insert([formData]));
    }

    if (error) {
      toast.error(`Error ${editingMaterial ? 'updating' : 'creating'} study material`);
      return;
    }

    toast.success(`Study material ${editingMaterial ? 'updated' : 'created'} successfully!`);
    resetForm();
    fetchMaterials();
  };

  const handleEdit = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || '',
      course_id: material.course_id,
      material_type: material.material_type,
      file_url: material.file_url || '',
      file_size: material.file_size || 0,
      mime_type: material.mime_type || '',
      file_extension: material.file_extension || '',
      duration: material.duration || '',
      is_downloadable: material.is_downloadable,
      sort_order: material.sort_order,
      is_active: material.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm('Are you sure you want to delete this study material?')) return;

    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      toast.error('Error deleting study material');
      return;
    }

    toast.success('Study material deleted successfully!');
    fetchMaterials();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMaterial(null);
    setFormData({
      title: '',
      description: '',
      course_id: '',
      material_type: 'pdf',
      file_url: '',
      file_size: 0,
      mime_type: '',
      file_extension: '',
      duration: '',
      is_downloadable: true,
      sort_order: 0,
      is_active: true
    });
  };

  const getMaterialIcon = (materialType: string) => {
    const type = materialTypes.find(t => t.value === materialType);
    return type ? type.icon : FileText;
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
            <h1 className="text-3xl font-bold mb-2">Study Materials Management</h1>
            <p className="text-gray-600">Manage course materials, PDFs, videos, and resources</p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Study Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? 'Edit' : 'Add'} Study Material</DialogTitle>
                <DialogDescription>
                  {editingMaterial ? 'Update the study material details.' : 'Add a new study material for a course.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">Course *</Label>
                    <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material_type">Material Type</Label>
                    <Select value={formData.material_type} onValueChange={(value) => setFormData({...formData, material_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materialTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="file_url">File URL</Label>
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                    placeholder="https://example.com/file.pdf"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 45 minutes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mime_type">MIME Type</Label>
                    <Input
                      id="mime_type"
                      value={formData.mime_type}
                      onChange={(e) => setFormData({...formData, mime_type: e.target.value})}
                      placeholder="e.g., application/pdf"
                    />
                  </div>
                  <div>
                    <Label htmlFor="file_extension">File Extension</Label>
                    <Input
                      id="file_extension"
                      value={formData.file_extension}
                      onChange={(e) => setFormData({...formData, file_extension: e.target.value})}
                      placeholder="e.g., pdf"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_downloadable"
                      checked={formData.is_downloadable}
                      onCheckedChange={(checked) => setFormData({...formData, is_downloadable: checked})}
                    />
                    <Label htmlFor="is_downloadable">Downloadable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMaterial ? 'Update' : 'Create'} Material
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Course Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCourse === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCourse('all')}
              size="sm"
            >
              All Courses
            </Button>
            {courses.map((course) => (
              <Button
                key={course.id}
                variant={selectedCourse === course.id ? 'default' : 'outline'}
                onClick={() => setSelectedCourse(course.id)}
                size="sm"
              >
                {course.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Materials List */}
        {materials.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Study Materials</h3>
              <p className="text-gray-600 mb-4">
                {selectedCourse === 'all' 
                  ? "No study materials have been created yet."
                  : "No study materials found for this course."
                }
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => {
              const IconComponent = getMaterialIcon(material.material_type);
              return (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        <Badge variant="outline" className="text-xs">
                          {material.material_type}
                        </Badge>
                        {!material.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(material)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription>
                      <span className="font-medium text-blue-600">
                        {material.courses?.title}
                      </span>
                      {material.description && (
                        <span className="block mt-1">{material.description}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Order: {material.sort_order}</span>
                      {material.duration && (
                        <span>Duration: {material.duration}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={material.is_downloadable ? 'text-green-600' : 'text-gray-500'}>
                        {material.is_downloadable ? 'Downloadable' : 'View Only'}
                      </span>
                      {material.file_url && (
                        <a 
                          href={material.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialManagement;
