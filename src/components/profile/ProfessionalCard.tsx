
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Building } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface ProfessionalCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const ProfessionalCard = ({ editing, formData, setFormData, profile }: ProfessionalCardProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-orange-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Professional Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="occupation" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Briefcase className="w-4 h-4 text-orange-500" />
            Occupation
          </Label>
          {editing ? (
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => setFormData(prev => ({...prev, occupation: e.target.value}))}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              placeholder="Enter your occupation"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.occupation || 'Not specified'}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Building className="w-4 h-4 text-red-500" />
            Company
          </Label>
          {editing ? (
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))}
              className="border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              placeholder="Enter your company name"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.company || 'Not specified'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
