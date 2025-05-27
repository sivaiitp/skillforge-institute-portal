
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Search, Award, Calendar, User, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CertificateVerification = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificate, setCertificate] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [foundButInvalid, setFoundButInvalid] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    setFoundButInvalid(false);

    try {
      console.log('Searching for certificate:', certificateNumber);
      
      // First, let's search for the certificate regardless of validity status
      const { data: allCerts, error: allCertsError } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title,
            certification
          ),
          profiles!certificates_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('certificate_number', certificateNumber.trim());

      console.log('All certificates query result:', { data: allCerts, error: allCertsError });

      // Now search for valid certificates only
      const { data, error } = await (supabase as any)
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title,
            certification
          ),
          profiles!certificates_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('certificate_number', certificateNumber.trim())
        .eq('is_valid', true)
        .maybeSingle();

      console.log('Valid certificate query result:', { data, error });

      if (error) {
        console.error('Error fetching certificate:', error);
        setCertificate(null);
        toast.error('Error searching for certificate.');
        return;
      }

      if (allCertsError) {
        console.error('Error fetching all certificates:', allCertsError);
        setCertificate(null);
        toast.error('Error searching for certificate.');
        return;
      }

      if (!data) {
        setCertificate(null);
        if (allCerts && allCerts.length > 0) {
          setFoundButInvalid(true);
          toast.error('Certificate found but is not valid (revoked).');
        } else {
          toast.error('Certificate not found.');
        }
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="w-full max-w-[85%] mx-auto px-4 text-center relative z-10">
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
        <div className="w-full max-w-[85%] mx-auto px-4">
          <div className="max-w-2xl mx-auto">
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
                              <p className="text-lg font-medium">{certificate.profiles?.full_name || 'Name not available'}</p>
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
                          
                          <div>
                            <Label className="text-sm font-semibold text-gray-600">Certificate Number</Label>
                            <p className="text-lg font-mono bg-gray-100 p-2 rounded mt-1">
                              {certificate.certificate_number}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                          <XCircle size={32} />
                          <div>
                            <h3 className="text-xl font-bold">
                              {foundButInvalid ? 'Certificate Revoked' : 'Certificate Not Found'}
                            </h3>
                            <p className="text-red-700">
                              {foundButInvalid 
                                ? 'This certificate exists but has been revoked'
                                : 'Unable to verify this certificate'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                          <h4 className="font-semibold text-red-800 mb-2">
                            {foundButInvalid ? 'Certificate Status:' : 'Possible reasons:'}
                          </h4>
                          {foundButInvalid ? (
                            <ul className="text-red-700 space-y-1">
                              <li>• This certificate has been revoked by the institution</li>
                              <li>• The certificate is no longer valid</li>
                              <li>• Please contact RaceCodingInstitute for more information</li>
                            </ul>
                          ) : (
                            <ul className="text-red-700 space-y-1">
                              <li>• The certificate number is incorrect or contains typos</li>
                              <li>• The certificate was not issued by RaceCodingInstitute</li>
                              <li>• The certificate may not exist in our system</li>
                            </ul>
                          )}
                          <p className="text-red-700 mt-4">
                            Please double-check the certificate number and try again. If you believe this is an error, 
                            please contact our support team with certificate number: <strong>{certificateNumber}</strong>
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CertificateVerification;
