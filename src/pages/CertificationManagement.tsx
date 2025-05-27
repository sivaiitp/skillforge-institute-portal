import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import NewIssueCertificateForm from '@/components/certification/NewIssueCertificateForm';
import StudentCertificatesSearch from '@/components/certification/StudentCertificatesSearch';
import { Award, Shield, CheckCircle, Users, TrendingUp } from 'lucide-react';

const CertificationManagement = () => {
  const { userRole } = useAuth();
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [validCertificates, setValidCertificates] = useState(0);
  const [certifiedStudents, setCertifiedStudents] = useState(0);

  useEffect(() => {
    if (userRole === 'admin') {
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

  const handleCertificateIssued = () => {
    fetchCertificateStats();
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="ml-64 p-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Certificate Management</h1>
                <p className="text-gray-600 text-lg">Issue and manage student certificates</p>
              </div>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-700 text-sm font-medium mb-1">Total Certificates</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCertificates}</p>
                    <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      All time
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-700 text-sm font-medium mb-1">Valid Certificates</p>
                    <p className="text-3xl font-bold text-gray-900">{validCertificates}</p>
                    <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 group hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium mb-1">Certified Students</p>
                    <p className="text-3xl font-bold text-gray-900">{certifiedStudents}</p>
                    <p className="text-blue-600 text-xs mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Unique students
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Issue Certificate Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Issue New Certificate</h2>
                  <p className="text-gray-600 text-sm">Award certificates to users</p>
                </div>
              </div>
              <NewIssueCertificateForm onCertificateIssued={handleCertificateIssued} />
            </div>
            
            {/* Student Certificates Search Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Manage Certificates</h2>
                  <p className="text-gray-600 text-sm">Search and manage user certificates</p>
                </div>
              </div>
              <StudentCertificatesSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationManagement;
