import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import IssueCertificateForm from '@/components/certification/IssueCertificateForm';
import VerifyCertificateForm from '@/components/certification/VerifyCertificateForm';
import CertificatesList from '@/components/certification/CertificatesList';
import { Award, Shield, CheckCircle, Users } from 'lucide-react';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_id: string;
  issued_date: string;
  is_valid: boolean;
  user_id: string;
  course_id: string;
  profiles?: {
    full_name?: string;
  } | null;
  courses?: {
    title?: string;
  } | null;
}

const CertificationManagement = () => {
  const { userRole } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
      // First get all certificates
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('*')
        .order('issued_date', { ascending: false });
      
      if (certificatesError) {
        console.error('Error fetching certificates:', certificatesError);
        toast.error('Error fetching certificates');
        return;
      }

      // Then fetch profiles and courses separately and combine
      const certificatesWithDetails = await Promise.all(
        (certificatesData || []).map(async (cert) => {
          const promises = [];
          
          // Fetch profile if user_id exists
          if (cert.user_id) {
            promises.push(
              supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', cert.user_id)
                .maybeSingle()
            );
          } else {
            promises.push(Promise.resolve({ data: null }));
          }

          // Fetch course if course_id exists
          if (cert.course_id) {
            promises.push(
              supabase
                .from('courses')
                .select('title, certification')
                .eq('id', cert.course_id)
                .maybeSingle()
            );
          } else {
            promises.push(Promise.resolve({ data: null }));
          }

          const [profileResult, courseResult] = await Promise.all(promises);

          return {
            ...cert,
            profiles: profileResult.data,
            courses: courseResult.data
          };
        })
      );

      setCertificates(certificatesWithDetails);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-300">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Certification Management</h1>
                <p className="text-gray-300">Issue and validate digital certificates</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm">Total Certificates</p>
                    <p className="text-2xl font-bold text-white">{certificates.length}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm">Valid Certificates</p>
                    <p className="text-2xl font-bold text-white">{certificates.filter(c => c.is_valid).length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm">Certified Students</p>
                    <p className="text-2xl font-bold text-white">{new Set(certificates.map(c => c.user_id)).size}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Issue Certificate</h2>
            </div>
            <IssueCertificateForm
              students={students}
              courses={courses}
              onCertificateIssued={fetchCertificates}
            />
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Verify Certificate</h2>
            </div>
            <VerifyCertificateForm
              onCertificateUpdated={fetchCertificates}
            />
          </div>
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
