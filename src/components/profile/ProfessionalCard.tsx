
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface ProfessionalCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const ProfessionalCard = ({ editing, formData, setFormData, profile }: ProfessionalCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Professional
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          {editing ? (
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => setFormData(prev => ({...prev, occupation: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.occupation || 'Not specified'}</p>
          )}
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          {editing ? (
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.company || 'Not specified'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
