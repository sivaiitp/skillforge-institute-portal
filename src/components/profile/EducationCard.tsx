
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, School, BookOpen, Calendar } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface EducationCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const EducationCard = ({ editing, formData, setFormData, profile }: EducationCardProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Education Background
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="education_level" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            Education Level
          </Label>
          {editing ? (
            <Select value={formData.education_level} onValueChange={(value) => setFormData(prev => ({...prev, education_level: value}))}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="associate">Associate Degree</SelectItem>
                <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                <SelectItem value="master">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.education_level || 'Not specified'}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <School className="w-4 h-4 text-purple-500" />
            Institution
          </Label>
          {editing ? (
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({...prev, institution: e.target.value}))}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Enter your institution name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.institution || 'Not specified'}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="field_of_study" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Field of Study
          </Label>
          {editing ? (
            <Input
              id="field_of_study"
              value={formData.field_of_study}
              onChange={(e) => setFormData(prev => ({...prev, field_of_study: e.target.value}))}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Enter your field of study"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.field_of_study || 'Not specified'}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="graduation_year" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 text-purple-500" />
            Graduation Year
          </Label>
          {editing ? (
            <Input
              id="graduation_year"
              type="number"
              value={formData.graduation_year}
              onChange={(e) => setFormData(prev => ({...prev, graduation_year: e.target.value}))}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="Enter graduation year"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.graduation_year || 'Not specified'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
