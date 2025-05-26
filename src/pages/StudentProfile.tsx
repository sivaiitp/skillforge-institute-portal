import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const StudentProfile = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
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

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data?.full_name || '',
        phone: data?.phone || '',
        address: data?.address || '',
        city: data?.city || '',
        state: data?.state || '',
        postal_code: data?.postal_code || '',
        country: data?.country || '',
        education_level: data?.education_level || '',
        institution: data?.institution || '',
        field_of_study: data?.field_of_study || '',
        graduation_year: data?.graduation_year ? data.graduation_year.toString() : '',
        occupation: data?.occupation || '',
        company: data?.company || '',
        bio: data?.bio || ''
      });
    } catch (error) {
      toast.error('Error fetching profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          education_level: formData.education_level,
          institution: formData.institution,
          field_of_study: formData.field_of_study,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
          occupation: formData.occupation,
          company: formData.company,
          bio: formData.bio,
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postal_code: profile?.postal_code || '',
      country: profile?.country || '',
      education_level: profile?.education_level || '',
      institution: profile?.institution || '',
      field_of_study: profile?.field_of_study || '',
      graduation_year: profile?.graduation_year ? profile.graduation_year.toString() : '',
      occupation: profile?.occupation || '',
      company: profile?.company || '',
      bio: profile?.bio || ''
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <StudentSidebar />
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">My Profile</h1>
              </header>
              
              <div className="flex-1 p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <p className="text-gray-600">Manage your personal information and preferences</p>
                  </div>
                  {!editing ? (
                    <Button onClick={() => setEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information */}
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
                            <p className="mt-1 text-sm text-gray-600">{user?.email}</p>
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

                    {/* Address Information */}
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

                    {/* Education Information */}
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

                    {/* Professional Information */}
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
                  </div>
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentProfile;
