
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_id: string;
  issued_date: string;
  is_valid: boolean;
  user_id: string;
  course_id: string;
  profiles?: {
    full_name?: string;
  } | null;
  courses?: {
    title?: string;
  } | null;
}

interface CertificatesListProps {
  certificates: Certificate[];
  loading: boolean;
  onCertificateUpdated: () => void;
}

const CertificatesList = ({ certificates, loading, onCertificateUpdated }: CertificatesListProps) => {
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
    onCertificateUpdated();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Certificates ({certificates.length})</CardTitle>
        <CardDescription>
          List of all issued certificates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : certificates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate Number</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono text-sm">
                    {cert.certificate_number || cert.certificate_id}
                  </TableCell>
                  <TableCell>{cert.profiles?.full_name || 'N/A'}</TableCell>
                  <TableCell>{cert.courses?.title || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(cert.issued_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cert.is_valid ? 'default' : 'destructive'}>
                      {cert.is_valid ? 'Valid' : 'Revoked'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCertificateValidity(cert.id, cert.is_valid)}
                    >
                      {cert.is_valid ? 'Revoke' : 'Validate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No certificates found</p>
            <p className="text-sm text-gray-400 mt-2">No certificates have been issued yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificatesList;
