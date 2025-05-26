
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface EducationCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const EducationCard = ({ editing, formData, setFormData, profile }: EducationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="education_level">Education Level</Label>
          {editing ? (
            <Select value={formData.education_level} onValueChange={(value) => setFormData(prev => ({...prev, education_level: value}))}>
              <SelectTrigger>
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
            <p className="mt-1 text-sm">{profile?.education_level || 'Not specified'}</p>
          )}
        </div>
        <div>
          <Label htmlFor="institution">Institution</Label>
          {editing ? (
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({...prev, institution: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.institution || 'Not specified'}</p>
          )}
        </div>
        <div>
          <Label htmlFor="field_of_study">Field of Study</Label>
          {editing ? (
            <Input
              id="field_of_study"
              value={formData.field_of_study}
              onChange={(e) => setFormData(prev => ({...prev, field_of_study: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.field_of_study || 'Not specified'}</p>
          )}
        </div>
        <div>
          <Label htmlFor="graduation_year">Graduation Year</Label>
          {editing ? (
            <Input
              id="graduation_year"
              type="number"
              value={formData.graduation_year}
              onChange={(e) => setFormData(prev => ({...prev, graduation_year: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.graduation_year || 'Not specified'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
