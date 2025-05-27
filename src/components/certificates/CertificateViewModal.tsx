
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Calendar, User, BookOpen, Download, X } from 'lucide-react';

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

interface CertificateViewModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (certificate: Certificate) => void;
}

const CertificateViewModal = ({ certificate, isOpen, onClose, onDownload }: CertificateViewModalProps) => {
  if (!certificate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-600" />
            Certificate Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Certificate Design */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-yellow-500 rounded-2xl p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-200/30 rounded-full"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200/30 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-indigo-200/30 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-200/30 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <Award className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto"></div>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
                <h2 className="text-3xl font-bold text-blue-800 mb-4">{certificate.profiles.full_name}</h2>
                <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
                <h3 className="text-2xl font-semibold text-indigo-700 mb-6">{certificate.courses.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
                <div className="bg-white/50 rounded-lg p-4">
                  <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">Date Issued</p>
                  <p className="text-gray-600">{new Date(certificate.issued_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <User className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">Certificate ID</p>
                  <p className="text-gray-600 font-mono text-xs">{certificate.certificate_number}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-700">Status</p>
                  <p className={`font-semibold ${certificate.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                    {certificate.is_valid ? 'Valid' : 'Revoked'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-6">
                <p className="text-sm text-gray-500">
                  This certificate verifies the successful completion of the above-mentioned course.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button 
              onClick={() => onDownload(certificate)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateViewModal;
