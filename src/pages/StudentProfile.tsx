
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, Edit } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentProfile = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    education_level: '',
    institution: '',
    field_of_study: '',
    graduation_year: '',
    occupation: '',
    company: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchProfile();
  }, [user, userRole, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || '',
          education_level: data.education_level || '',
          institution: data.institution || '',
          field_of_study: data.field_of_study || '',
          graduation_year: data.graduation_year?.toString() || '',
          occupation: data.occupation || '',
          company: data.company || '',
          bio: data.bio || ''
        });
      } else {
        setProfile(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (error) {
      toast.error('Error fetching profile');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const profileData = {
        id: user.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        postal_code: profile.postal_code,
        country: profile.country,
        education_level: profile.education_level,
        institution: profile.institution,
        field_of_study: profile.field_of_study,
        graduation_year: profile.graduation_year ? parseInt(profile.graduation_year) : null,
        occupation: profile.occupation,
        company: profile.company,
        bio: profile.bio,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error:', error);
    }
    setSaving(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <StudentSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading profile...</p>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Profile Management</h1>
          </header>
          
          <div className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-gray-600">Manage your profile details and preferences</p>
              </div>
              
              <div className="flex gap-2">
                {!editing ? (
                  <Button onClick={() => setEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => setEditing(false)} 
                      variant="outline"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Details
                  </CardTitle>
                  <CardDescription>Basic information about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Your residential details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profile.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={profile.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profile.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Education Details</CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="education_level">Education Level</Label>
                    <Select 
                      value={profile.education_level} 
                      onValueChange={(value) => handleInputChange('education_level', value)}
                      disabled={!editing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={profile.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="field_of_study">Field of Study</Label>
                    <Input
                      id="field_of_study"
                      value={profile.field_of_study}
                      onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="graduation_year">Graduation Year</Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      value={profile.graduation_year}
                      onChange={(e) => handleInputChange('graduation_year', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Your work and career information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={profile.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentProfile;
