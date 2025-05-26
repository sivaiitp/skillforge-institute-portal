
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Download, Calendar, CreditCard, DollarSign, Receipt, TrendingUp } from "lucide-react";
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
      completed: { color: "bg-green-100 text-green-800 border-green-200" },
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      failed: { color: "bg-red-100 text-red-800 border-red-200" },
      refunded: { color: "bg-gray-100 text-gray-800 border-gray-200" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <StudentSidebar />
          
          <SidebarInset className="flex-1 ml-64">
            <header className="flex h-16 shrink-0 items-center gap-2 px-6 border-b bg-white/80 backdrop-blur-sm">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Payment History
                </h1>
              </div>
            </header>
            
            <div className="flex justify-center">
              <div className="p-8 space-y-8 max-w-7xl w-full">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    Payment History
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Track all your course payments and transaction history
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${stats.totalSpent.toFixed(2)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Across all courses</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Receipt className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {stats.totalPayments}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Transactions made</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600">Last Payment</CardTitle>
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-gray-800">
                        {stats.lastPayment ? new Date(stats.lastPayment.payment_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Most recent transaction</p>
                    </CardContent>
                  </Card>
                </div>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600">Loading payment history...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <Card className="text-center py-16 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent>
                      <div className="p-8 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <Wallet className="h-16 w-16 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">No Payments Yet</h3>
                      <p className="text-gray-600 mb-8 text-lg">You haven't made any payments yet.</p>
                      <Button 
                        onClick={() => navigate('/courses')}
                        className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-3 text-lg"
                      >
                        Browse Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border-b border-indigo-100">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                        Payment Transactions
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Complete history of your payments and transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/50">
                              <TableHead className="font-semibold text-gray-700">Date</TableHead>
                              <TableHead className="font-semibold text-gray-700">Course</TableHead>
                              <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                              <TableHead className="font-semibold text-gray-700">Method</TableHead>
                              <TableHead className="font-semibold text-gray-700">Status</TableHead>
                              <TableHead className="font-semibold text-gray-700">Transaction ID</TableHead>
                              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payments.map((payment) => (
                              <TableRow key={payment.id} className="hover:bg-indigo-50/50 transition-colors">
                                <TableCell className="font-medium">
                                  {new Date(payment.payment_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {payment.courses?.title || payment.description}
                                    </div>
                                    {payment.courses?.category && (
                                      <div className="text-sm text-gray-500">{payment.courses.category}</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold text-lg">
                                    ${parseFloat(payment.amount.toString()).toFixed(2)} {payment.currency}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-gray-50">
                                    {payment.payment_method || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(payment.status)}
                                </TableCell>
                                <TableCell>
                                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                    {payment.transaction_id || 'N/A'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {payment.status === 'completed' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadReceipt(payment)}
                                      className="hover:bg-indigo-100 hover:text-indigo-700"
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudentPayments;
