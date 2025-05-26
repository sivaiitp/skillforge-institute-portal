
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save, X } from 'lucide-react';

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  price: string;
  certification: string;
  image_url: string;
  brochure_url: string;
  detailed_description: string;
  prerequisites: string;
  learning_outcomes: string;
  is_featured: boolean;
  is_active: boolean;
}

interface CourseFormProps {
  formData: CourseFormData;
  setFormData: (data: CourseFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingCourse: any;
  courseCategories: string[];
}

const CourseForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  editingCourse, 
  courseCategories 
}: CourseFormProps) => {
  const handleFileUpload = (type: 'image' | 'brochure') => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // For now, we'll use a placeholder URL
        // In a real implementation, you'd upload to storage and get the URL
        const mockUrl = `https://example.com/${type}s/${file.name}`;
        if (type === 'image') {
          setFormData({...formData, image_url: mockUrl});
        } else {
          setFormData({...formData, brochure_url: mockUrl});
        }
      }
    };
    
    fileInput.click();
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Save className="w-5 h-5 text-blue-600" />
          {editingCourse ? 'Edit Course' : 'Create New Course'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter course title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 8 weeks"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-sm font-medium text-gray-700">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certification" className="text-sm font-medium text-gray-700">Certification</Label>
              <Input
                id="certification"
                value={formData.certification}
                onChange={(e) => setFormData({...formData, certification: e.target.value})}
                placeholder="Certificate name"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Course Image</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Image URL or upload file"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleFileUpload('image')}
                  className="px-3 border-gray-200 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Course Brochure</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.brochure_url}
                  onChange={(e) => setFormData({...formData, brochure_url: e.target.value})}
                  placeholder="PDF URL or upload file"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleFileUpload('brochure')}
                  className="px-3 border-gray-200 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              placeholder="Brief course overview for cards and listings"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed_description" className="text-sm font-medium text-gray-700">Detailed Description</Label>
            <Textarea
              id="detailed_description"
              value={formData.detailed_description}
              onChange={(e) => setFormData({...formData, detailed_description: e.target.value})}
              rows={4}
              placeholder="Comprehensive course description for the details page"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites" className="text-sm font-medium text-gray-700">Prerequisites</Label>
            <Textarea
              id="prerequisites"
              value={formData.prerequisites}
              onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
              rows={2}
              placeholder="What students need to know before taking this course"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learning_outcomes" className="text-sm font-medium text-gray-700">Learning Outcomes</Label>
            <Textarea
              id="learning_outcomes"
              value={formData.learning_outcomes}
              onChange={(e) => setFormData({...formData, learning_outcomes: e.target.value})}
              rows={3}
              placeholder="What students will learn (one per line)"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Course</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
          
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingCourse ? 'Update Course' : 'Create Course'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
