
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  certificate_number: string;
  certificate_id: string;
  issued_date: string;
  is_valid: boolean;
  profiles?: {
    full_name?: string;
  } | null;
  courses?: {
    title?: string;
  } | null;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  data?: Certificate;
}

interface VerifyCertificateFormProps {
  onCertificateUpdated: () => void;
}

const VerifyCertificateForm = ({ onCertificateUpdated }: VerifyCertificateFormProps) => {
  const [verificationNumber, setVerificationNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerifyCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationNumber) {
      toast.error('Please enter a certificate number');
      return;
    }

    console.log('Verifying certificate:', verificationNumber);

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (title, certification),
        profiles (full_name, email)
      `)
      .or(`certificate_number.eq.${verificationNumber},certificate_id.eq.${verificationNumber}`)
      .maybeSingle();

    console.log('Verification result:', { data, error });

    if (error) {
      console.error('Error verifying certificate:', error);
      setVerificationResult({ valid: false, message: 'Error verifying certificate' });
      return;
    }

    if (!data) {
      setVerificationResult({ valid: false, message: 'Certificate not found' });
      return;
    }

    setVerificationResult({
      valid: data.is_valid,
      data: data,
      message: data.is_valid ? 'Certificate is valid' : 'Certificate has been revoked'
    });
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
    onCertificateUpdated();
    setVerificationResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Verify Certificate
        </CardTitle>
        <CardDescription>
          Verify the authenticity of a certificate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyCertificate} className="space-y-4">
          <div>
            <Label htmlFor="verificationNumber">Certificate Number</Label>
            <Input
              id="verificationNumber"
              value={verificationNumber}
              onChange={(e) => setVerificationNumber(e.target.value)}
              placeholder="Enter certificate number"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Verify Certificate
          </Button>
        </form>

        {verificationResult && (
          <div className={`mt-4 p-4 rounded-lg ${verificationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {verificationResult.valid ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${verificationResult.valid ? 'text-green-800' : 'text-red-800'}`}>
                {verificationResult.message}
              </span>
            </div>
            
            {verificationResult.data && (
              <div className="text-sm space-y-1">
                <p><strong>Student:</strong> {verificationResult.data.profiles?.full_name || 'N/A'}</p>
                <p><strong>Course:</strong> {verificationResult.data.courses?.title || 'N/A'}</p>
                <p><strong>Issued:</strong> {new Date(verificationResult.data.issued_date).toLocaleDateString()}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => toggleCertificateValidity(verificationResult.data!.id, verificationResult.data!.is_valid)}
                >
                  {verificationResult.data.is_valid ? 'Revoke' : 'Validate'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyCertificateForm;
