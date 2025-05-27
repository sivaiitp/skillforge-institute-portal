
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Users, Eye, Download, Trash2, User, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import CertificateViewModal from './CertificateViewModal';
import { downloadCertificateAsPDF } from '@/utils/certificateUtils';

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
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const {
    searchName,
    setSearchName,
    searchResults,
    selectedStudent,
    isSearching,
    hasSearched,
    handleSearchStudent,
    handleSelectStudent,
    handleClearStudent
  } = useStudentSearch();

  const handleSearch = async () => {
    console.log('Starting search for:', searchName);
    await handleSearchStudent();
  };

  const handleSelectAndSearch = async (student: any) => {
    console.log('Student selected:', student);
    await handleSelectStudent(student);
    await onSearch(student.id);
  };

  const handleClear = () => {
    handleClearStudent();
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowViewModal(true);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    downloadCertificateAsPDF(certificate);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedCertificate(null);
  };

  console.log('Current state:', { searchResults, selectedStudent, searchName, isSearching, hasSearched });

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            Search Certificates
          </CardTitle>
          <CardDescription className="text-base text-gray-600 leading-relaxed">
            Search for certificates issued to a specific student by their name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Input Row */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Student Name
            </Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter student name to search certificates..."
                  className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchName.trim() || searchName.trim().length < 2}
                variant="outline"
                className="px-4 border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                {isSearching ? 'Searching...' : <Search className="w-4 h-4" />}
              </Button>
              {(selectedStudent || searchResults.length > 0) && (
                <Button 
                  onClick={handleClear}
                  variant="outline"
                  className="px-4 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </Button>
              )}
            </div>
            {searchName.trim().length > 0 && searchName.trim().length < 2 && (
              <p className="text-sm text-gray-500">Type at least 2 characters to search</p>
            )}
          </div>
          
          {/* Search Results Row - Single Column */}
          {searchResults.length > 0 && !selectedStudent && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Search Results ({searchResults.length} found)
              </Label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {searchResults.map((student) => (
                  <div 
                    key={student.id}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors cursor-pointer"
                    onClick={() => handleSelectAndSearch(student)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-blue-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-blue-800 truncate">{student.full_name}</p>
                          <p className="text-sm text-blue-600 truncate">{student.email}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndSearch(student);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Student Display */}
          {selectedStudent && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-800">{selectedStudent.full_name}</p>
                  <p className="text-sm text-green-600">{selectedStudent.email}</p>
                </div>
                <Button 
                  onClick={() => onSearch(selectedStudent.id)}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  size="sm"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Loading...' : 'View Certificates'}
                </Button>
              </div>
            </div>
          )}

          {/* No Results Message - only show after search is complete */}
          {hasSearched && searchName.trim().length >= 2 && searchResults.length === 0 && !selectedStudent && !isSearching && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 font-medium text-center">
                No students found matching "{searchName}". Try a different search term.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificates Display */}
      {selectedStudent && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Certificates for {selectedStudent.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 font-medium">Loading certificates...</p>
              </div>
            ) : certificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium text-lg">No certificates found</p>
                <p className="text-gray-500 text-sm">This student hasn't been issued any certificates yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Certificate Number</label>
                          <p className="font-mono text-sm font-medium text-gray-800 mt-1">{certificate.certificate_number}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</label>
                          <p className="text-sm font-medium text-gray-800 mt-1">{certificate.courses?.title}</p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Issued Date</label>
                          <p className="text-sm font-medium text-gray-800 mt-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(certificate.issued_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                          <div className="mt-1">
                            {certificate.is_valid ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle className="w-3 h-3" />
                                Valid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3" />
                                Revoked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleViewCertificate(certificate)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-green-50 hover:border-green-300"
                          onClick={() => handleDownloadCertificate(certificate)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {certificate.is_valid && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onRevoke(certificate.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificate View Modal */}
      <CertificateViewModal
        certificate={selectedCertificate}
        isOpen={showViewModal}
        onClose={handleCloseModal}
        onDownload={handleDownloadCertificate}
      />
    </div>
  );
};

export default CertificateSearchForm;
