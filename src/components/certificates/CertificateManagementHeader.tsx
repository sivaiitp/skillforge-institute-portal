
import { Award } from 'lucide-react';

const CertificateManagementHeader = () => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Certificate Management</h1>
            <p className="text-gray-600">Issue and manage course certificates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagementHeader;
