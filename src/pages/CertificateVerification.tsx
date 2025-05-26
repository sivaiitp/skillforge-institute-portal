
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CertificateVerification = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (title, certification),
          profiles (full_name)
        `)
        .eq('certificate_number', certificateNumber.trim())
        .eq('is_valid', true)
        .single();

      if (error || !data) {
        setCertificate(null);
        toast.error('Certificate not found or invalid.');
      } else {
        setCertificate(data);
        toast.success('Certificate verified successfully!');
      }
    } catch (error) {
      setCertificate(null);
      toast.error('Error verifying certificate.');
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Certificate Verification
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by SkillTech Institute.
          </p>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={24} />
                Verify Certificate
              </CardTitle>
              <CardDescription>
                Enter the certificate number to verify its authenticity and view details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input
                    id="certificateNumber"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Enter certificate number (e.g., CERT-2024-001)"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSearching}
                >
                  {isSearching ? 'Verifying...' : 'Verify Certificate'}
                </Button>
              </form>

              {/* Results */}
              {hasSearched && (
                <div className="mt-8 pt-8 border-t">
                  {certificate ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={24} />
                        <span className="text-lg font-semibold">Certificate Verified</span>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg space-y-4">
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Student Name</Label>
                          <p className="text-lg">{certificate.profiles?.full_name || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Course</Label>
                          <p className="text-lg">{certificate.courses?.title}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Certification</Label>
                          <p className="text-lg">{certificate.courses?.certification}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Issue Date</Label>
                          <p className="text-lg">
                            {new Date(certificate.issued_date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Certificate Number</Label>
                          <p className="text-lg font-mono">{certificate.certificate_number}</p>
                        </div>
                        
                        <Badge className="bg-green-100 text-green-800">
                          Valid Certificate
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle size={24} />
                        <span className="text-lg font-semibold">Certificate Not Found</span>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-lg">
                        <p className="text-red-700">
                          The certificate number you entered is either invalid or the certificate has been revoked. 
                          Please check the number and try again.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificateVerification;
