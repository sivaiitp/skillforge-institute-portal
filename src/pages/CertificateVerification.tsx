
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, Award, Calendar, User, BookOpen } from "lucide-react";
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
      console.log('Searching for certificate:', certificateNumber);
      
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title,
            certification
          ),
          profiles (
            id,
            full_name,
            email
          )
        `)
        .or(`certificate_number.eq.${certificateNumber.trim()},certificate_id.eq.${certificateNumber.trim()}`)
        .eq('is_valid', true)
        .maybeSingle();

      console.log('Certificate query result:', { data, error });

      if (error) {
        console.error('Error fetching certificate:', error);
        setCertificate(null);
        toast.error('Error searching for certificate.');
        return;
      }

      if (!data) {
        setCertificate(null);
        toast.error('Certificate not found or invalid.');
      } else {
        setCertificate(data);
        toast.success('Certificate verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setCertificate(null);
      toast.error('Error verifying certificate.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Award className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Certificate Verification
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Verify the authenticity of certificates issued by RaceCodingInstitute. 
            Enter the certificate number to check its validity and view details.
          </p>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-20 flex-1">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Search size={28} />
                Verify Certificate
              </CardTitle>
              <CardDescription className="text-lg">
                Enter the certificate number to verify its authenticity and view details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <Label htmlFor="certificateNumber" className="text-base font-medium">
                    Certificate Number
                  </Label>
                  <Input
                    id="certificateNumber"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    placeholder="Enter certificate number (e.g., CERT-2024-001234)"
                    required
                    className="mt-2 text-lg py-3"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The certificate number can be found on your certificate document
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
                  disabled={isSearching || !certificateNumber.trim()}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </form>

              {/* Results */}
              {hasSearched && (
                <div className="mt-8 pt-8 border-t">
                  {certificate ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-green-600">
                        <CheckCircle size={32} />
                        <div>
                          <h3 className="text-xl font-bold">Certificate Verified</h3>
                          <p className="text-green-700">This certificate is authentic and valid</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6">
                        {/* Student Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-gray-600" />
                              <Label className="text-sm font-semibold text-gray-600">Student Name</Label>
                            </div>
                            <p className="text-lg font-medium">{certificate.profiles?.full_name || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen className="w-5 h-5 text-gray-600" />
                              <Label className="text-sm font-semibold text-gray-600">Course</Label>
                            </div>
                            <p className="text-lg font-medium">{certificate.courses?.title}</p>
                          </div>
                        </div>
                        
                        {/* Certificate Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-5 h-5 text-gray-600" />
                              <Label className="text-sm font-semibold text-gray-600">Certification</Label>
                            </div>
                            <p className="text-lg font-medium">{certificate.courses?.certification || 'Course Completion Certificate'}</p>
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-gray-600" />
                              <Label className="text-sm font-semibold text-gray-600">Issue Date</Label>
                            </div>
                            <p className="text-lg font-medium">
                              {new Date(certificate.issued_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {certificate.expiry_date && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-gray-600" />
                              <Label className="text-sm font-semibold text-gray-600">Expiry Date</Label>
                            </div>
                            <p className="text-lg font-medium">
                              {new Date(certificate.expiry_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Certificate Number</Label>
                          <p className="text-lg font-mono bg-gray-100 p-2 rounded mt-1">
                            {certificate.certificate_number || certificate.certificate_id}
                          </p>
                        </div>
                        
                        <div className="flex justify-center">
                          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Valid Certificate
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-red-600">
                        <XCircle size={32} />
                        <div>
                          <h3 className="text-xl font-bold">Certificate Not Found</h3>
                          <p className="text-red-700">Unable to verify this certificate</p>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h4 className="font-semibold text-red-800 mb-2">Possible reasons:</h4>
                        <ul className="text-red-700 space-y-1">
                          <li>• The certificate number is incorrect or contains typos</li>
                          <li>• The certificate has been revoked or is no longer valid</li>
                          <li>• The certificate was not issued by RaceCodingInstitute</li>
                        </ul>
                        <p className="text-red-700 mt-4">
                          Please double-check the certificate number and try again. If you believe this is an error, 
                          please contact our support team.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Information Section */}
              <div className="mt-8 pt-8 border-t bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-blue-800 mb-3">About Certificate Verification</h4>
                <div className="text-blue-700 space-y-2 text-sm">
                  <p>• All certificates issued by RaceCodingInstitute can be verified through this system</p>
                  <p>• Certificate numbers are unique and cannot be duplicated</p>
                  <p>• This verification system checks our secure database in real-time</p>
                  <p>• For any questions about certificate verification, please contact our support team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificateVerification;
