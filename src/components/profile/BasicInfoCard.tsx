
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
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
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            {editing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.full_name || 'Not specified'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <p className="mt-1 text-sm text-gray-600">{userEmail}</p>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            {editing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.phone || 'Not specified'}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          {editing ? (
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.bio || 'No bio available'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
