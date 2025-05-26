
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Award, Calendar, CheckCircle, XCircle, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_id: string;
  issued_date: string;
  is_valid: boolean;
  courses?: {
    title?: string;
    certification?: string;
  } | null;
}

const StudentCertificatesSearch = () => {
  const [studentEmail, setStudentEmail] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchCertificates = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentEmail) {
      toast.error('Please enter a student email');
      return;
    }

    setIsLoading(true);
    console.log('Searching certificates for email:', studentEmail);

    try {
      // First, find the student by email
      const { data: student, error: studentError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('email', studentEmail)
        .eq('role', 'student')
        .maybeSingle();

      if (studentError) {
        console.error('Error finding student:', studentError);
        toast.error('Error searching for student');
        setIsLoading(false);
        return;
      }

      if (!student) {
        toast.error('No student found with this email');
        setCertificates([]);
        setStudentName('');
        setIsLoading(false);
        return;
      }

      setStudentName(student.full_name || 'Unknown');

      // Get certificates for this student
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_number,
          certificate_id,
          issued_date,
          is_valid,
          courses (
            title,
            certification
          )
        `)
        .eq('user_id', student.id)
        .order('issued_date', { ascending: false });

      if (certificatesError) {
        console.error('Error fetching certificates:', certificatesError);
        toast.error('Error fetching certificates');
        setIsLoading(false);
        return;
      }

      setCertificates(certificatesData || []);
      
      if (!certificatesData || certificatesData.length === 0) {
        toast.info('No certificates found for this student');
      }

    } catch (error) {
      console.error('Error searching certificates:', error);
      toast.error('Error searching certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCertificateValidity = async (certificateId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('certificates')
      .update({ is_valid: !currentStatus })
      .eq('id', certificateId);

    if (error) {
      console.error('Error updating certificate status:', error);
      toast.error('Error updating certificate status');
      return;
    }

    toast.success(`Certificate ${!currentStatus ? 'validated' : 'revoked'} successfully!`);
    
    // Refresh the certificates list
    handleSearchCertificates(new Event('submit') as any);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearchCertificates} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentEmail" className="text-sm font-medium text-gray-700">
            Student Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="studentEmail"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Enter student email address"
              className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search Certificates
            </>
          )}
        </Button>
      </form>

      {/* Results Section */}
      {studentName && (
        <div className="space-y-4">
          {/* Student Info Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{studentName}</h3>
                <p className="text-sm text-blue-700">{studentEmail}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-600">Certificates Found</p>
                <p className="text-xl font-bold text-blue-600">{certificates.length}</p>
              </div>
            </div>
          </div>
          
          {/* Certificates List */}
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Found</h3>
              <p className="text-gray-600">This student hasn't been issued any certificates yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                    certificate.is_valid 
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300' 
                      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          {certificate.is_valid ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full">
                                Valid Certificate
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-600" />
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                Revoked Certificate
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Certificate Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Certificate Number</p>
                            <p className="font-mono font-medium text-gray-900 bg-white px-3 py-1 rounded-lg border">
                              {certificate.certificate_number}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Course</p>
                            <p className="font-medium text-gray-900">{certificate.courses?.title || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Certification Type</p>
                            <p className="font-medium text-gray-900">{certificate.courses?.certification || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Issue Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <p className="font-medium text-gray-900">
                                {new Date(certificate.issued_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="ml-6">
                        <Button
                          variant={certificate.is_valid ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleCertificateValidity(certificate.id, certificate.is_valid)}
                          className={`min-w-[80px] transition-all duration-300 ${
                            certificate.is_valid 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {certificate.is_valid ? 'Revoke' : 'Validate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 ${
                    certificate.is_valid 
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                      : 'bg-gradient-to-r from-red-400 to-rose-500'
                  }`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCertificatesSearch;
