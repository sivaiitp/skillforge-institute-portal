import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const StudentCertificates = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchCertificates();
  }, [user, userRole, navigate]);

  const fetchCertificates = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      
      setCertificates(data || []);
    } catch (error) {
      toast.error('Error fetching certificates');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownload = (certificate) => {
    // In a real implementation, this would generate and download a PDF certificate
    toast.success(`Certificate ${certificate.certificate_id} download started`);
  };

  const handleView = (certificate) => {
    // In a real implementation, this would open a modal or new page to view the certificate
    toast.info(`Viewing certificate ${certificate.certificate_id}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <StudentSidebar />
            <SidebarInset className="flex-1">
              <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                <SidebarTrigger className="-ml-1" />
                <h1 className="text-xl font-semibold">My Certifications</h1>
              </header>
              
              <div className="flex-1 p-6 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">My Certifications</h2>
                  <p className="text-gray-600">View and download your earned certificates</p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading certificates...</p>
                  </div>
                ) : certificates.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                      <p className="text-gray-600 mb-4">Complete courses to earn your first certificate.</p>
                      <Button onClick={() => navigate('/courses')}>
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <Award className="h-8 w-8 text-yellow-500" />
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Earned
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{certificate.courses?.title}</CardTitle>
                          <CardDescription>
                            Certificate #{certificate.certificate_id}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Issued: {new Date(certificate.issued_date).toLocaleDateString()}
                            </div>
                            {certificate.expiry_date && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                Expires: {new Date(certificate.expiry_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDownload(certificate)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleView(certificate)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      <Footer />
    </div>
  );
};

export default StudentCertificates;
