
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert to key-value object for easier access
      const settings: Record<string, string> = {};
      data?.forEach(setting => {
        settings[setting.key] = setting.value || '';
      });
      
      return settings;
    }
  });
};

export const useHomepageContent = () => {
  return useQuery({
    queryKey: ['homepage-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useAboutContent = () => {
  return useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });
};

export const useFacultyMembers = () => {
  return useQuery({
    queryKey: ['faculty-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    }
  });
};
