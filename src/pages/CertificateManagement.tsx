
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import CertificateManagementHeader from '@/components/certificates/CertificateManagementHeader';
import CertificateIssueForm from '@/components/certificates/CertificateIssueForm';
import CertificateSearchForm from '@/components/certificates/CertificateSearchForm';
import { useCertificateManagement } from '@/hooks/useCertificateManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CertificateManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  
  const {
    certificates,
    loading,
    issueCertificate,
    revokeCertificate,
    searchCertificatesByUser
  } = useCertificateManagement();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [user, userRole, navigate]);

  const handleIssueCertificate = async (selectedStudent: any, selectedCourse: string) => {
    const success = await issueCertificate(selectedStudent, selectedCourse);
    return success;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <CertificateManagementHeader />

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <Tabs defaultValue="issue" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-blue-100 to-indigo-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="issue" 
                  className="text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 rounded-lg transition-all duration-200"
                >
                  Issue New Certificate
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 rounded-lg transition-all duration-200"
                >
                  Search Certificates
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="issue" className="mt-6">
                <CertificateIssueForm
                  onIssue={handleIssueCertificate}
                  loading={loading}
                />
              </TabsContent>
              
              <TabsContent value="search" className="mt-6">
                <CertificateSearchForm
                  onSearch={searchCertificatesByUser}
                  certificates={certificates}
                  loading={loading}
                  onRevoke={revokeCertificate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagement;
