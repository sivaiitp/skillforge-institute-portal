
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Award, Plus, Eye, Download, Trash2 } from 'lucide-react';

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

interface CertificatesTableProps {
  certificates: Certificate[];
  loading: boolean;
  onRevoke: (certificateId: string) => void;
  onShowIssueForm: () => void;
}

const CertificatesTable = ({ certificates, loading, onRevoke, onShowIssueForm }: CertificatesTableProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Loading certificates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Issued Certificates (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Certificates Issued</h3>
            <p className="text-gray-600 mb-6">Start by issuing your first certificate to a student.</p>
            <Button 
              onClick={onShowIssueForm}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Issue First Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Issued Certificates ({certificates.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Certificate Number</th>
                <th className="text-left p-4">Student</th>
                <th className="text-left p-4">Course</th>
                <th className="text-left p-4">Issued Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm">{certificate.certificate_number}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{certificate.profiles?.full_name}</p>
                      <p className="text-sm text-gray-600">{certificate.profiles?.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{certificate.courses?.title}</td>
                  <td className="p-4">{new Date(certificate.issued_date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      certificate.is_valid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {certificate.is_valid ? 'Valid' : 'Revoked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      {certificate.is_valid && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onRevoke(certificate.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificatesTable;
