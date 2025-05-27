
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        <CertificateManagementHeader />

        <Tabs defaultValue="issue" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="issue" className="text-sm font-medium">
              Issue New Certificate
            </TabsTrigger>
            <TabsTrigger value="search" className="text-sm font-medium">
              Search Certificates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="issue">
            <CertificateIssueForm
              onIssue={handleIssueCertificate}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="search">
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
  );
};

export default CertificateManagement;
