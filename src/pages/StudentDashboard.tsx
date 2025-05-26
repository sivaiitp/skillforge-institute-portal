
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Award } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
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
    
    fetchMyCertificates();
  }, [user, userRole, navigate]);

  const fetchMyCertificates = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (title, certification, description)
      `)
      .eq('user_id', user.id)
      .eq('is_valid', true)
      .order('issued_date', { ascending: false });

    if (error) {
      toast.error('Error fetching certificates');
      console.error('Error:', error);
    } else {
      setCertificates(data || []);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">My Certificates</h1>
            <p className="text-gray-600">View and manage your earned certificates</p>
          </div>

          {loading ? (
            <div className="text-center">
              <p>Loading certificates...</p>
            </div>
          ) : certificates.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <CardTitle>No Certificates Yet</CardTitle>
                <CardDescription>
                  Complete courses to earn certificates that will appear here.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Award className="h-8 w-8 text-blue-600" />
                      <Badge className="bg-green-100 text-green-800">
                        Grade: {cert.grade}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{cert.courses?.title}</CardTitle>
                    <CardDescription>{cert.courses?.certification}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Certificate Number:</span>
                        <p className="font-mono text-xs">{cert.certificate_number}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Completion Date:</span>
                        <p>{cert.completion_date ? new Date(cert.completion_date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Issued Date:</span>
                        <p>{new Date(cert.issued_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">
                        This certificate can be verified at {window.location.origin}/verify
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
