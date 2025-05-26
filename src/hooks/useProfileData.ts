
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

export interface ProfileFormData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  education_level: string;
  institution: string;
  field_of_study: string;
  graduation_year: string;
  occupation: string;
  company: string;
  bio: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
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

  return {
    profile,
    loading,
    editing,
    formData,
    setEditing,
    setFormData,
    handleSave,
    handleCancel,
    user
  };
};
