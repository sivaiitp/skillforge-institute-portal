import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Eye, Calendar, CheckCircle, Trophy } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <StudentSidebar />
          
          {/* Content Area */}
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  My Certifications
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    My Certifications
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    View and download your earned certificates
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading certificates...</p>
                  </div>
                ) : certificates.length === 0 ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <Trophy className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Certificates Yet</h3>
                      <p className="text-gray-600 mb-8 text-lg">Complete courses to earn your first certificate.</p>
                      <Button 
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
                      >
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((certificate) => (
                      <Card key={certificate.id} className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-white">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                          <div className="relative z-10 flex items-start justify-between">
                            <Award className="h-10 w-10 text-yellow-100" />
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Earned
                            </Badge>
                          </div>
                          <div className="relative z-10 mt-4">
                            <CardTitle className="text-xl text-white mb-2">{certificate.courses?.title}</CardTitle>
                            <CardDescription className="text-yellow-100">
                              Certificate #{certificate.certificate_id}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              <Calendar className="w-4 h-4 mr-3 text-yellow-500" />
                              <div>
                                <div className="font-medium text-gray-800">Issued</div>
                                <div>{new Date(certificate.issued_date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            {certificate.expiry_date && (
                              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Calendar className="w-4 h-4 mr-3 text-orange-500" />
                                <div>
                                  <div className="font-medium text-gray-800">Expires</div>
                                  <div>{new Date(certificate.expiry_date).toLocaleDateString()}</div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                              onClick={() => handleDownload(certificate)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
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
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentCertificates;
