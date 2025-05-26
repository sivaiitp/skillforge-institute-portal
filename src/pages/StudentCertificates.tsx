
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Calendar, CheckCircle } from "lucide-react";
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
            title,
            certification,
            description,
            category,
            level
          )
        `)
        .eq('user_id', user.id)
        .eq('is_valid', true)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      toast.error('Error fetching certificates');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownloadCertificate = (certificate) => {
    // In a real implementation, this would generate and download a PDF certificate
    toast.success(`Certificate ${certificate.certificate_number} download started`);
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">My Certifications</h1>
          </header>
          
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Your Earned Certificates</h2>
              <p className="text-gray-600">Download and share your achievements</p>
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
                  <p className="text-gray-600 mb-4">Complete courses to earn certificates.</p>
                  <Button onClick={() => navigate('/dashboard/courses')}>
                    View My Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-yellow-600" />
                      </div>
                      <CardTitle className="text-lg">{certificate.courses?.title}</CardTitle>
                      <CardDescription>{certificate.courses?.certification}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Certificate #</span>
                          <span className="font-mono">{certificate.certificate_number}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Issued Date</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(certificate.issued_date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Valid
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          onClick={() => handleDownloadCertificate(certificate)}
                          className="w-full"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
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
  );
};

export default StudentCertificates;
