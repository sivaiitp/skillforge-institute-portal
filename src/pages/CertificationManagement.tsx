
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import IssueCertificateForm from '@/components/certification/IssueCertificateForm';
import VerifyCertificateForm from '@/components/certification/VerifyCertificateForm';
import CertificatesList from '@/components/certification/CertificatesList';

const CertificationManagement = () => {
  const { userRole } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCertificates();
      fetchStudents();
      fetchCourses();
    }
  }, [userRole]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (title, certification),
          profiles (full_name, email)
        `)
        .order('issued_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching certificates:', error);
        toast.error('Error fetching certificates');
        return;
      }
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Error fetching certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'student')
        .order('full_name');
      
      if (error) {
        console.error('Error fetching students:', error);
        toast.error('Error fetching students');
        return;
      }
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Error fetching students');
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, certification')
        .eq('is_active', true)
        .order('title');
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses');
        return;
      }
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error fetching courses');
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div>Access denied</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Certification Management</h1>
          <p className="text-gray-600">Issue and validate certificates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <IssueCertificateForm
            students={students}
            courses={courses}
            onCertificateIssued={fetchCertificates}
          />
          
          <VerifyCertificateForm
            onCertificateUpdated={fetchCertificates}
          />
        </div>

        <CertificatesList
          certificates={certificates}
          loading={loading}
          onCertificateUpdated={fetchCertificates}
        />
      </div>
    </div>
  );
};

export default CertificationManagement;
