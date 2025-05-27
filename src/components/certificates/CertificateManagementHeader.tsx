
import { Award, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CertificateManagementHeaderProps {
  onIssueClick: () => void;
}

const CertificateManagementHeader = ({ onIssueClick }: CertificateManagementHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Certificate Management</h1>
              <p className="text-gray-600">Issue and manage course certificates</p>
            </div>
          </div>
          <Button 
            onClick={onIssueClick}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagementHeader;
