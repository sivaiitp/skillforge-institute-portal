
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import CertificateManagementHeader from '@/components/certificates/CertificateManagementHeader';
import CertificateIssueForm from '@/components/certificates/CertificateIssueForm';
import CertificatesTable from '@/components/certificates/CertificatesTable';
import { useCertificateManagement } from '@/hooks/useCertificateManagement';

const CertificateManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [showIssueForm, setShowIssueForm] = useState(false);
  
  const {
    certificates,
    loading,
    issueCertificate,
    revokeCertificate
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

  const handleIssueClick = () => {
    setShowIssueForm(true);
  };

  const handleIssueCancel = () => {
    setShowIssueForm(false);
  };

  const handleIssueCertificate = async (selectedStudent: any, selectedCourse: string) => {
    const success = await issueCertificate(selectedStudent, selectedCourse);
    if (success) {
      setShowIssueForm(false);
    }
    return success;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <AdminSidebar />
      
      <div className="ml-64 p-6">
        <CertificateManagementHeader onIssueClick={handleIssueClick} />

        {showIssueForm && (
          <CertificateIssueForm
            onIssue={handleIssueCertificate}
            onCancel={handleIssueCancel}
            loading={loading}
          />
        )}

        <CertificatesTable
          certificates={certificates}
          loading={loading}
          onRevoke={revokeCertificate}
          onShowIssueForm={handleIssueClick}
        />
      </div>
    </div>
  );
};

export default CertificateManagement;
