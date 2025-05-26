import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Career from "./pages/Career";
import Events from "./pages/Events";
import CertificateVerification from "./pages/CertificateVerification";
import NotFound from "./pages/NotFound";
import CourseLearning from "./pages/CourseLearning";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import CourseManagement from "./pages/CourseManagement";
import StudyMaterialManagement from "./pages/StudyMaterialManagement";
import CourseMaterialsDetail from "./pages/CourseMaterialsDetail";
import StudentManagement from "./pages/StudentManagement";
import AssessmentManagement from "./pages/AssessmentManagement";
import CertificationManagement from "./pages/CertificationManagement";
import PaymentReports from "./pages/PaymentReports";

// Student pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentStudyMaterials from "./pages/StudentStudyMaterials";
import StudentAssessments from "./pages/StudentAssessments";
import StudentCertificates from "./pages/StudentCertificates";
import StudentPayments from "./pages/StudentPayments";
import StudentProfile from "./pages/StudentProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/course/:id/learn" element={<CourseLearning />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/career" element={<Career />} />
              <Route path="/events" element={<Events />} />
              <Route path="/verify-certificate" element={<CertificateVerification />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<CourseManagement />} />
              <Route path="/admin/study-materials" element={<StudyMaterialManagement />} />
              <Route path="/admin/study-materials/course/:courseId" element={<CourseMaterialsDetail />} />
              <Route path="/admin/students" element={<StudentManagement />} />
              <Route path="/admin/assessments" element={<AssessmentManagement />} />
              <Route path="/admin/certifications" element={<CertificationManagement />} />
              <Route path="/admin/payments" element={<PaymentReports />} />
              
              {/* Student routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/dashboard/courses" element={<StudentCourses />} />
              <Route path="/dashboard/course/:courseId/learn" element={<StudentCourseLearning />} />
              <Route path="/dashboard/study-materials" element={<StudentStudyMaterials />} />
              <Route path="/dashboard/assessments" element={<StudentAssessments />} />
              <Route path="/dashboard/certificates" element={<StudentCertificates />} />
              <Route path="/dashboard/payments" element={<StudentPayments />} />
              <Route path="/dashboard/profile" element={<StudentProfile />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
