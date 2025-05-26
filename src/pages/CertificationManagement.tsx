
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import IssueCertificateForm from '@/components/certification/IssueCertificateForm';
import VerifyCertificateForm from '@/components/certification/VerifyCertificateForm';
import { Award, Shield, CheckCircle, Users } from 'lucide-react';

const CertificationManagement = () => {
  const { userRole } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [validCertificates, setValidCertificates] = useState(0);
  const [certifiedStudents, setCertifiedStudents] = useState(0);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchStudents();
      fetchCourses();
      fetchCertificateStats();
    }
  }, [userRole]);

  const fetchCertificateStats = async () => {
    try {
      const { data: certificatesData, error } = await supabase
        .from('certificates')
        .select('id, is_valid, user_id');
      
      if (error) {
        console.error('Error fetching certificate stats:', error);
        return;
      }

      setTotalCertificates(certificatesData?.length || 0);
      setValidCertificates(certificatesData?.filter(c => c.is_valid).length || 0);
      setCertifiedStudents(new Set(certificatesData?.map(c => c.user_id)).size || 0);
    } catch (error) {
      console.error('Error fetching certificate stats:', error);
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

  const handleCertificateIssued = () => {
    fetchCertificateStats();
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AdminSidebar />
        <div className="ml-64 p-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Certification Management</h1>
                <p className="text-gray-600">Issue and validate digital certificates</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Total Certificates</p>
                    <p className="text-2xl font-bold text-gray-800">{totalCertificates}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Valid Certificates</p>
                    <p className="text-2xl font-bold text-gray-800">{validCertificates}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Certified Students</p>
                    <p className="text-2xl font-bold text-gray-800">{certifiedStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-800">Issue Certificate</h2>
            </div>
            <IssueCertificateForm
              students={students}
              courses={courses}
              onCertificateIssued={handleCertificateIssued}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Verify Certificate</h2>
            </div>
            <VerifyCertificateForm
              onCertificateUpdated={handleCertificateIssued}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationManagement;
