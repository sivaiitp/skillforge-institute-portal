
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthProvider';

interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  is_valid: boolean;
  user_id: string;
  course_id: string;
  courses: {
    title: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

export const useCertificateManagement = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (title),
          profiles!certificates_user_id_fkey (full_name, email)
        `)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      toast.error('Error fetching certificates');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCertificatesByUser = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (title),
          profiles!certificates_user_id_fkey (full_name, email)
        `)
        .eq('user_id', userId)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      toast.error('Error searching certificates');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async (selectedStudent: any, selectedCourse: string) => {
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both a student and a course');
      return null;
    }

    try {
      setLoading(true);

      const { data, error } = await (supabase as any)
        .from('certificates')
        .insert([
          {
            user_id: selectedStudent.id,
            course_id: selectedCourse,
            issuer_id: user?.id
          }
        ])
        .select(`
          *,
          courses (title),
          profiles!certificates_user_id_fkey (full_name, email)
        `)
        .single();

      if (error) throw error;

      toast.success('Certificate issued successfully!');
      return data;
    } catch (error) {
      toast.error('Error issuing certificate');
      console.error('Error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const revokeCertificate = async (certificateId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('certificates')
        .update({ is_valid: false })
        .eq('id', certificateId);

      if (error) throw error;

      toast.success('Certificate revoked successfully');
      // Refresh the current certificates list
      setCertificates(prev => prev.map(cert => 
        cert.id === certificateId ? { ...cert, is_valid: false } : cert
      ));
    } catch (error) {
      toast.error('Error revoking certificate');
      console.error('Error:', error);
    }
  };

  return {
    certificates,
    loading,
    fetchCertificates,
    searchCertificatesByUser,
    issueCertificate,
    revokeCertificate
  };
};
