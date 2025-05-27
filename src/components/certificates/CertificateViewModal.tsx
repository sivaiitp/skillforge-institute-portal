
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Calendar, User, BookOpen, Download, X, GraduationCap } from 'lucide-react';

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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            Certificate Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          {/* Certificate Design */}
          <div className="relative bg-white border rounded-2xl p-0 text-center overflow-hidden shadow-2xl" style={{ aspectRatio: '1414/1000' }}>
            {/* Blue curved background design */}
            <div className="absolute inset-0">
              {/* Top right curved element */}
              <div className="absolute top-0 right-0 w-80 h-80">
                <svg viewBox="0 0 320 320" className="w-full h-full">
                  <path d="M320,0 L320,200 Q200,320 0,320 L0,0 Z" fill="#2563eb" opacity="0.9"/>
                </svg>
              </div>
              {/* Bottom left curved element */}
              <div className="absolute bottom-0 left-0 w-96 h-96">
                <svg viewBox="0 0 384 384" className="w-full h-full">
                  <path d="M0,384 L0,184 Q120,64 320,64 L384,64 L384,384 Z" fill="#2563eb" opacity="0.9"/>
                </svg>
              </div>
              {/* Large watermark background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <div className="text-9xl font-bold text-gray-600 transform -rotate-12">RaceCoding</div>
              </div>
            </div>
            
            <div className="relative z-10 p-12 h-full flex flex-col">
              {/* Header with logos */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800">RaceCoding</h3>
                    <p className="text-xs text-gray-600">Excellence in Digital Education</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700">2024</div>
                </div>
              </div>
              
              {/* Certificate Title */}
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-blue-700 mb-2 tracking-wider">
                  CERTIFICATE
                </h1>
                <h2 className="text-4xl font-bold text-blue-700 tracking-wider">
                  OF COMPLETION
                </h2>
              </div>
              
              {/* Certificate Content */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <p className="text-lg text-gray-700 font-medium">
                  This certificate is proudly presented to
                </p>
                
                <div className="my-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">{certificate.profiles.full_name}</h2>
                  <div className="w-32 h-0.5 bg-gray-400 mx-auto"></div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg text-gray-700">has successfully completed the course on</p>
                  <h3 className="text-2xl font-bold text-blue-700 px-6 py-2">
                    {certificate.courses.title}
                  </h3>
                  <p className="text-lg text-gray-700">Conducted by RaceCoding Institute</p>
                  <p className="text-lg text-gray-700">
                    on {new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              {/* Footer with signatures */}
              <div className="mt-8 grid grid-cols-3 gap-8 text-sm">
                <div className="text-center">
                  <div className="w-24 h-px bg-gray-400 mx-auto mb-2"></div>
                  <p className="font-semibold text-gray-700">Technical Director</p>
                  <p className="text-gray-600">RaceCoding</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-px bg-gray-400 mx-auto mb-2"></div>
                  <p className="font-semibold text-gray-700">Overall Head</p>
                  <p className="text-gray-600">RaceCoding Institute</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-px bg-gray-400 mx-auto mb-2"></div>
                  <p className="font-semibold text-gray-700">Business Head</p>
                  <p className="text-gray-600">RaceCoding</p>
                </div>
              </div>
              
              {/* Certificate ID */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Certificate ID: {certificate.certificate_number} | 
                  Status: <span className={certificate.is_valid ? 'text-green-600' : 'text-red-600'}>
                    {certificate.is_valid ? 'Valid' : 'Revoked'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button 
              onClick={() => onDownload(certificate)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg transition-all duration-200"
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
