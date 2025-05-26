
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Auth from "./pages/Auth";
import CertificateVerification from "./pages/CertificateVerification";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentManagement from "./pages/StudentManagement";
import CourseManagement from "./pages/CourseManagement";
import AssessmentManagement from "./pages/AssessmentManagement";
import CertificationManagement from "./pages/CertificationManagement";
import PaymentReports from "./pages/PaymentReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/career" element={<Career />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify" element={<CertificateVerification />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/assessments" element={<AssessmentManagement />} />
            <Route path="/admin/certificates" element={<CertificationManagement />} />
            <Route path="/admin/reports" element={<PaymentReports />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
