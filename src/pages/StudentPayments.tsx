
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Download, Calendar, CreditCard } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentPayments = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalPayments: 0,
    lastPayment: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchPayments();
  }, [user, userRole, navigate]);

  const fetchPayments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          courses (
            id,
            title,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      const paymentsData = data || [];
      setPayments(paymentsData);
      
      // Calculate stats
      const totalSpent = paymentsData
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
      
      const lastPayment = paymentsData.length > 0 ? paymentsData[0] : null;
      
      setStats({
        totalSpent,
        totalPayments: paymentsData.length,
        lastPayment
      });
    } catch (error) {
      toast.error('Error fetching payment history');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleDownloadReceipt = (payment) => {
    // In a real implementation, this would generate and download a PDF receipt
    toast.success(`Receipt for payment ${payment.transaction_id} download started`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "default", color: "bg-green-100 text-green-800" },
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      failed: { variant: "destructive", color: "bg-red-100 text-red-800" },
      refunded: { variant: "outline", color: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Payment History</h1>
          </header>
          
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <p className="text-gray-600">Track all your course payments and transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Across all courses</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPayments}</div>
                  <p className="text-xs text-muted-foreground">Transactions made</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.lastPayment ? new Date(stats.lastPayment.payment_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">Most recent transaction</p>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading payment history...</p>
              </div>
            ) : payments.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Payments Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't made any payments yet.</p>
                  <Button onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>Complete history of your payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.courses?.title || payment.description}</div>
                              {payment.courses?.category && (
                                <div className="text-sm text-gray-500">{payment.courses.category}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${parseFloat(payment.amount.toString()).toFixed(2)} {payment.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            {payment.payment_method || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {payment.transaction_id || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {payment.status === 'completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadReceipt(payment)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentPayments;
