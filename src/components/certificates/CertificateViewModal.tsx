
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, Calendar, User, BookOpen, Download, X, GraduationCap, MapPin, Phone, Mail, Globe } from 'lucide-react';

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
          <div className="relative bg-white rounded-2xl p-0 text-center overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-200 via-purple-200 to-blue-200" style={{ aspectRatio: '1414/1000' }}>
            {/* Elegant Border Design */}
            <div className="absolute inset-3 border-2 border-double border-blue-300 rounded-xl"></div>
            <div className="absolute inset-5 border border-gold-300 rounded-lg opacity-40"></div>
            
            {/* Corner decorative elements */}
            <div className="absolute top-6 left-6 w-12 h-12 border-l-4 border-t-4 border-gold-400 rounded-tl-lg opacity-60"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-r-4 border-t-4 border-gold-400 rounded-tr-lg opacity-60"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-l-4 border-b-4 border-gold-400 rounded-bl-lg opacity-60"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-r-4 border-b-4 border-gold-400 rounded-br-lg opacity-60"></div>
            
            <div className="relative z-10 p-8 h-full flex flex-col">
              {/* Enhanced Header with Authority Info */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-800 tracking-wide">RaceCoding Institute</h3>
                    <p className="text-sm text-gray-600 font-medium">Excellence in Digital Education</p>
                    <p className="text-xs text-gray-500 mt-1">Authorized Training & Certification Center</p>
                  </div>
                </div>
                <div className="text-right bg-gradient-to-br from-blue-100 to-purple-100 px-4 py-2 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700 tracking-wider">2024</div>
                  <div className="text-xs text-blue-600 font-medium">Certificate Year</div>
                </div>
              </div>
              
              {/* Certificate Title */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent rounded-xl opacity-30"></div>
                <div className="relative py-3">
                  <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 bg-clip-text mb-1 tracking-wider">
                    CERTIFICATE
                  </h1>
                  <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text tracking-wider">
                    OF COMPLETION
                  </h2>
                </div>
              </div>
              
              {/* Certificate Content */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <p className="text-lg text-gray-700 font-medium">
                  This certificate is proudly presented to
                </p>
                
                <div className="my-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-50 to-transparent rounded-xl"></div>
                  <div className="relative py-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide">{certificate.profiles.full_name}</h2>
                    <div className="flex justify-center">
                      <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-lg text-gray-700">has successfully completed the course on</p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-xl border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-700 tracking-wide">
                      {certificate.courses.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 mt-3">Conducted by RaceCoding Institute</p>
                  <p className="text-base text-gray-600 font-medium">
                    on {new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Authority Information Section */}
              <div className="mt-8 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">Issuing Authority</h4>
                    <div className="space-y-1 text-gray-600">
                      <p className="font-semibold text-blue-700">RaceCoding Institute Pvt. Ltd.</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>123 Tech Park, Digital City, TC 560001</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>+91-9876543210</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>certificates@racecoding.com</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>www.racecoding.com</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">Accreditation & Recognition</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>• ISO 9001:2015 Certified Training Institute</p>
                      <p>• Approved by Ministry of Skill Development</p>
                      <p>• Recognized by Industry Skills Council</p>
                      <p>• Member of International Training Association</p>
                      <p className="text-xs text-gray-500 mt-2">License No: EDU/CERT/2024/RC001</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signatures section */}
              <div className="mt-6">
                <div className="grid grid-cols-3 gap-8 text-xs">
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-2"></div>
                    <p className="font-bold text-gray-700 text-sm">Dr. Rajesh Kumar</p>
                    <p className="text-gray-600">Technical Director</p>
                    <p className="text-gray-500">RaceCoding Institute</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-2"></div>
                    <p className="font-bold text-gray-700 text-sm">Prof. Meera Sharma</p>
                    <p className="text-gray-600">Academic Head</p>
                    <p className="text-gray-500">RaceCoding Institute</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-2"></div>
                    <p className="font-bold text-gray-700 text-sm">Mr. Arjun Singh</p>
                    <p className="text-gray-600">CEO & Founder</p>
                    <p className="text-gray-500">RaceCoding Institute</p>
                  </div>
                </div>
              </div>
              
              {/* Certificate ID and Verification */}
              <div className="mt-6 text-center bg-gray-50 py-2 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-medium">
                  Certificate ID: <span className="font-mono font-bold text-gray-800">{certificate.certificate_number}</span> | 
                  Status: <span className={`font-bold ${certificate.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                    {certificate.is_valid ? 'Valid & Verified' : 'Revoked'}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Verify this certificate at: www.racecoding.com/verify
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
