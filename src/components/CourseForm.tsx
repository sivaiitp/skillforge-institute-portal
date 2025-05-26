
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
