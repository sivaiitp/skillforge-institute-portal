
import { Award, Sparkles } from 'lucide-react';

const CertificateManagementHeader = () => {
  return (
    <div className="mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/30 to-orange-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Certificate Management
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Issue and manage course certificates with elegance and precision
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagementHeader;
