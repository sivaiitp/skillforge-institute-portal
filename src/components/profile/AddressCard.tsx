
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface AddressCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const AddressCard = ({ editing, formData, setFormData, profile }: AddressCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Street Address</Label>
          {editing ? (
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
            />
          ) : (
            <p className="mt-1 text-sm">{profile?.address || 'Not specified'}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="city">City</Label>
            {editing ? (
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.city || 'Not specified'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            {editing ? (
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.state || 'Not specified'}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            {editing ? (
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({...prev, postal_code: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.postal_code || 'Not specified'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            {editing ? (
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
              />
            ) : (
              <p className="mt-1 text-sm">{profile?.country || 'Not specified'}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
