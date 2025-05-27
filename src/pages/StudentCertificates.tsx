
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { StudentSidebar } from '@/components/StudentSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  is_valid: boolean;
  courses: {
    title: string;
    certification: string;
  };
}

const StudentCertificates = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (
            title,
            certification
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_valid', true)
        .order('issued_date', { ascending: false });

      if (error) {
        console.error('Error fetching certificates:', error);
        toast.error('Error loading certificates');
        return;
      }

      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Error loading certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificate: Certificate) => {
    // For now, just show a toast. In a real app, this would generate/download the PDF
    toast.info('Certificate download feature coming soon!');
  };

  const handleVerify = (certificateNumber: string) => {
    navigate(`/verify-certificate?cert=${certificateNumber}`);
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <StudentSidebar />
        
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                  <p className="text-gray-600">View and manage your earned certificates</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading your certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Award className="w-20 h-20 text-gray-300 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Certificates Yet</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    You haven't earned any certificates yet. Complete your courses to earn certificates!
                  </p>
                  <Button 
                    onClick={() => navigate('/my-courses')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View My Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <Card key={certificate.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-bold text-gray-800">
                                  {certificate.courses?.certification || 'Certificate'}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                  {certificate.courses?.title}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Issued: {new Date(certificate.issued_date).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Certificate Number</p>
                              <p className="font-mono text-sm font-medium text-gray-800">
                                {certificate.certificate_number}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleVerify(certificate.certificate_number)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Verify
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => handleDownload(certificate)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentCertificates;
