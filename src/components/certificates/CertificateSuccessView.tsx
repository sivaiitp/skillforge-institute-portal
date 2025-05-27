
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Eye, Download } from 'lucide-react';
import CertificateViewModal from './CertificateViewModal';
import { downloadCertificateAsPDF } from '@/utils/certificateUtils';
import { useState } from 'react';

interface CertificateSuccessViewProps {
  certificate: any;
  onStartNew: () => void;
}

const CertificateSuccessView = ({ certificate, onStartNew }: CertificateSuccessViewProps) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleViewCertificate = () => {
    setShowCertificateModal(true);
  };

  const handleDownloadCertificate = () => {
    if (certificate) {
      downloadCertificateAsPDF(certificate);
    }
  };

  const handleCloseModal = () => {
    setShowCertificateModal(false);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
      <CardHeader className="pb-6 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Certificate Issued Successfully!
        </CardTitle>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          The certificate has been generated and is ready for viewing and download.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-emerald-800 text-lg">
              Certificate Details
            </h3>
            <div className="space-y-2 text-sm text-emerald-700">
              <p><strong>Student:</strong> {certificate.profiles?.full_name}</p>
              <p><strong>Course:</strong> {certificate.courses?.title}</p>
              <p><strong>Certificate ID:</strong> <span className="font-mono">{certificate.certificate_number}</span></p>
              <p><strong>Issue Date:</strong> {new Date(certificate.issued_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleViewCertificate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Certificate
          </Button>
          <Button
            onClick={handleDownloadCertificate}
            variant="outline"
            className="border-2 border-green-500 text-green-700 hover:bg-green-50 px-6 py-3"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-100 text-center">
          <Button
            onClick={onStartNew}
            variant="outline"
            className="px-6 py-2"
          >
            Issue Another Certificate
          </Button>
        </div>
      </CardContent>

      <CertificateViewModal
        certificate={certificate}
        isOpen={showCertificateModal}
        onClose={handleCloseModal}
        onDownload={handleDownloadCertificate}
      />
    </Card>
  );
};

export default CertificateSuccessView;
