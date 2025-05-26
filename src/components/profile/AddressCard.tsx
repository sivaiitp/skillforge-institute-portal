
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Home, Building } from "lucide-react";
import { ProfileFormData } from "@/hooks/useProfileData";

interface AddressCardProps {
  editing: boolean;
  formData: ProfileFormData;
  setFormData: (updater: (prev: ProfileFormData) => ProfileFormData) => void;
  profile: any;
}

export const AddressCard = ({ editing, formData, setFormData, profile }: AddressCardProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-emerald-100">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Address Information
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Home className="w-4 h-4 text-emerald-500" />
            Street Address
          </Label>
          {editing ? (
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
              className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
              placeholder="Enter your street address"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-800">{profile?.address || 'Not specified'}</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building className="w-4 h-4 text-teal-500" />
              City
            </Label>
            {editing ? (
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                placeholder="City"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.city || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
            {editing ? (
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                placeholder="State"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.state || 'Not specified'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">Postal Code</Label>
            {editing ? (
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData(prev => ({...prev, postal_code: e.target.value}))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                placeholder="Postal Code"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.postal_code || 'Not specified'}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
            {editing ? (
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400"
                placeholder="Country"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">{profile?.country || 'Not specified'}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
