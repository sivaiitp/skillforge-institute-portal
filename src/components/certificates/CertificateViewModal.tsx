
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
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
          <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-4 border-amber-400 rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full -translate-x-12 translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-200/20 to-transparent rounded-full translate-x-12 translate-y-12"></div>
            
            {/* Inner border */}
            <div className="absolute inset-4 border-2 border-amber-300/50 rounded-2xl"></div>
            
            <div className="relative z-10">
              {/* Institute Header */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">RaceCoding Institute</h3>
                <p className="text-sm text-gray-600 font-medium tracking-wider">Excellence in Digital Education</p>
              </div>
              
              {/* Certificate Title */}
              <div className="mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Certificate of Completion
                </h1>
                <div className="w-40 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
              </div>
              
              {/* Achievement Section */}
              <div className="mb-8 space-y-4">
                <p className="text-lg text-gray-600 font-medium">This certifies that</p>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">{certificate.profiles.full_name}</h2>
                  <div className="w-32 h-0.5 bg-amber-500 mx-auto"></div>
                </div>
                <p className="text-lg text-gray-600 font-medium">has successfully completed the course</p>
                <h3 className="text-3xl font-bold text-blue-700 px-6 py-3 bg-white/50 rounded-xl border border-blue-200">
                  {certificate.courses.title}
                </h3>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-700 mb-1">Date Issued</p>
                  <p className="text-gray-600 font-medium">
                    {new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-700 mb-1">Certificate ID</p>
                  <p className="text-gray-600 font-mono text-sm break-all">{certificate.certificate_number}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-bold text-gray-700 mb-1">Status</p>
                  <p className={`font-bold text-lg ${certificate.is_valid ? 'text-green-600' : 'text-red-600'}`}>
                    {certificate.is_valid ? 'Valid' : 'Revoked'}
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-300 pt-6 space-y-3">
                <div className="w-48 h-px bg-gray-400 mx-auto"></div>
                <p className="text-sm font-semibold text-gray-700">Authorized Signature</p>
                <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
                  This certificate can be verified at our official website using Certificate ID: {certificate.certificate_number}<br/>
                  Issued by RaceCoding Institute | Digital Learning Excellence
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
