
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
          <div className="relative bg-white rounded-3xl p-0 text-center overflow-hidden shadow-2xl border-8 border-gradient-to-r from-blue-200 via-purple-200 to-blue-200" style={{ aspectRatio: '1414/1000' }}>
            {/* Elegant Border Design */}
            <div className="absolute inset-4 border-4 border-double border-blue-300 rounded-2xl"></div>
            <div className="absolute inset-6 border-2 border-gold-300 rounded-xl opacity-60"></div>
            
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.3"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.2"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.1"/>
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.3"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.2"/>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.1"/>
                </svg>
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-8 left-8 w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
                <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
              </svg>
            </div>
            <div className="absolute top-8 right-8 w-16 h-16 transform rotate-90">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
                <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
              </svg>
            </div>
            <div className="absolute bottom-8 left-8 w-16 h-16 transform rotate-270">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
                <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
              </svg>
            </div>
            <div className="absolute bottom-8 right-8 w-16 h-16 transform rotate-180">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
                <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
              </svg>
            </div>
            
            <div className="relative z-10 p-12 h-full flex flex-col">
              {/* Header with enhanced styling */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 tracking-wide">RaceCoding</h3>
                    <p className="text-sm text-gray-600 font-medium">Excellence in Digital Education</p>
                  </div>
                </div>
                <div className="text-right bg-gradient-to-br from-blue-100 to-purple-100 px-6 py-3 rounded-2xl border-2 border-blue-200">
                  <div className="text-3xl font-bold text-blue-700 tracking-wider">2024</div>
                </div>
              </div>
              
              {/* Certificate Title with enhanced styling */}
              <div className="mb-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent rounded-xl opacity-50"></div>
                <div className="relative py-4">
                  <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 bg-clip-text mb-2 tracking-wider">
                    CERTIFICATE
                  </h1>
                  <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text tracking-wider">
                    OF COMPLETION
                  </h2>
                </div>
              </div>
              
              {/* Certificate Content with enhanced styling */}
              <div className="flex-1 flex flex-col justify-center space-y-8">
                <p className="text-xl text-gray-700 font-medium">
                  This certificate is proudly presented to
                </p>
                
                <div className="my-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-50 to-transparent rounded-xl"></div>
                  <div className="relative py-6">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6 tracking-wide">{certificate.profiles.full_name}</h2>
                    <div className="flex justify-center">
                      <div className="w-48 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xl text-gray-700">has successfully completed the course on</p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-2xl border-2 border-blue-200">
                    <h3 className="text-3xl font-bold text-blue-700 tracking-wide">
                      {certificate.courses.title}
                    </h3>
                  </div>
                  <p className="text-xl text-gray-700 mt-4">Conducted by RaceCoding Institute</p>
                  <p className="text-lg text-gray-600 font-medium">
                    on {new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              {/* Enhanced signatures section */}
              <div className="mt-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50 to-transparent rounded-xl"></div>
                <div className="relative py-6">
                  <div className="grid grid-cols-3 gap-12 text-sm">
                    <div className="text-center">
                      <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-3"></div>
                      <p className="font-bold text-gray-700 text-base">Technical Director</p>
                      <p className="text-gray-600 mt-1">RaceCoding</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-3"></div>
                      <p className="font-bold text-gray-700 text-base">Overall Head</p>
                      <p className="text-gray-600 mt-1">RaceCoding Institute</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-3"></div>
                      <p className="font-bold text-gray-700 text-base">Business Head</p>
                      <p className="text-gray-600 mt-1">RaceCoding</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced certificate ID */}
              <div className="mt-8 text-center bg-gray-50 py-3 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 font-medium">
                  Certificate ID: <span className="font-mono font-bold text-gray-800">{certificate.certificate_number}</span> | 
                  Status: <span className={`font-bold ${certificate.is_valid ? 'text-green-600' : 'text-red-600'}`}>
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
