
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Users, Eye, Download, Trash2 } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';

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

interface CertificateSearchFormProps {
  onSearch: (userId: string) => Promise<void>;
  certificates: Certificate[];
  loading: boolean;
  onRevoke: (certificateId: string) => void;
}

const CertificateSearchForm = ({ onSearch, certificates, loading, onRevoke }: CertificateSearchFormProps) => {
  const [hasSearched, setHasSearched] = useState(false);
  
  const {
    searchName,
    setSearchName,
    selectedStudent,
    isSearching,
    handleSearchStudent,
    handleClearStudent
  } = useStudentSearch();

  const handleSearch = async () => {
    await handleSearchStudent();
    setHasSearched(true);
  };

  const handleSearchCertificates = async () => {
    if (selectedStudent) {
      await onSearch(selectedStudent.id);
    }
  };

  const handleClear = () => {
    handleClearStudent();
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Certificates</CardTitle>
          <CardDescription>
            Search for certificates issued to a specific student by their name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Student Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter student name to search"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                variant="outline"
              >
                <Search className="w-4 h-4" />
              </Button>
              {selectedStudent && (
                <Button 
                  onClick={handleClear}
                  variant="outline"
                >
                  Clear
                </Button>
              )}
            </div>
            
            {selectedStudent && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="font-medium">{selectedStudent.full_name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                <Button 
                  onClick={handleSearchCertificates}
                  disabled={loading}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasSearched && selectedStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Certificates for {selectedStudent.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading certificates...</p>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No certificates found for this student.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Certificate Number</th>
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificateSearchForm;
