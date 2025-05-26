
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Award, Calendar, CheckCircle, XCircle } from 'lucide-react';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Student Certificates
        </CardTitle>
        <CardDescription>
          Search for certificates by student email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearchCertificates} className="space-y-4">
          <div>
            <Label htmlFor="studentEmail">Student Email</Label>
            <Input
              id="studentEmail"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Enter student email address"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Certificates'}
          </Button>
        </form>

        {studentName && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Certificates for {studentName} ({studentEmail})
            </h3>
            
            {certificates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No certificates found for this student</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className={`p-4 rounded-lg border ${
                      certificate.is_valid 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {certificate.is_valid ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            certificate.is_valid ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {certificate.is_valid ? 'Valid Certificate' : 'Revoked Certificate'}
                          </span>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <p><strong>Certificate Number:</strong> {certificate.certificate_number}</p>
                          <p><strong>Course:</strong> {certificate.courses?.title || 'N/A'}</p>
                          <p><strong>Certification:</strong> {certificate.courses?.certification || 'N/A'}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span><strong>Issued:</strong> {new Date(certificate.issued_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCertificateValidity(certificate.id, certificate.is_valid)}
                      >
                        {certificate.is_valid ? 'Revoke' : 'Validate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCertificatesSearch;
