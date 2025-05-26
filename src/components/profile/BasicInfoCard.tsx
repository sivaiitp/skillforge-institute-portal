
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, FileText } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface BasicInfoCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
  userEmail: string;
}

export const BasicInfoCard = ({ editing, formData, setFormData, profile, userEmail }: BasicInfoCardProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-b border-violet-100">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Basic Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4 text-violet-500" />
              Full Name
            </Label>
            {editing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
                className="border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.full_name || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4 text-indigo-500" />
              Email Address
            </Label>
            <div className="p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {userEmail}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4 text-violet-500" />
              Phone Number
            </Label>
            {editing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                className="border-violet-200 focus:border-violet-400 focus:ring-violet-400"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.phone || 'Not specified'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-indigo-500" />
            Bio
          </Label>
          {editing ? (
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
              placeholder="Tell us about yourself, your interests, and learning goals..."
              className="min-h-[120px] border-violet-200 focus:border-violet-400 focus:ring-violet-400"
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[120px]">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {profile?.bio || 'No bio available - Add some information about yourself!'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
