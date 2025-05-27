
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import CourseManagement from "./pages/CourseManagement";
import StudentManagement from "./pages/StudentManagement";
import AssessmentManagement from "./pages/AssessmentManagement";
import CertificateManagement from "./pages/CertificateManagement";
import EventManagement from "./pages/EventManagement";
import PaymentReports from "./pages/PaymentReports";
import StudyMaterialManagement from "./pages/StudyMaterialManagement";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/StudentCourses";
import StudentProfile from "./pages/StudentProfile";
import StudentPayments from "./pages/StudentPayments";
import StudentAssessments from "./pages/StudentAssessments";
import StudentStudyMaterials from "./pages/StudentStudyMaterials";
import CourseLearning from "./pages/CourseLearning";
import StudentCourseLearning from "./pages/StudentCourseLearning";
import CourseMaterialsDetail from "./pages/CourseMaterialsDetail";
import CertificateVerification from "./pages/CertificateVerification";
import StudentCertificates from "./pages/StudentCertificates";
import Career from "./pages/Career";
import Events from "./pages/Events";
import FreeAssessment from "./pages/FreeAssessment";
import PersonalizedAssessment from "./pages/PersonalizedAssessment";
import NotFound from "./pages/NotFound";
import TakeAssessment from "./pages/TakeAssessment";
import AssessmentResult from "./pages/AssessmentResult";
import AssessmentHistory from "./pages/AssessmentHistory";
import QuestionManagementSystem from "./pages/QuestionManagementSystem";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/career" element={<Career />} />
              <Route path="/events" element={<Events />} />
              <Route path="/free-assessment" element={<FreeAssessment />} />
              <Route path="/personalized-assessment" element={<PersonalizedAssessment />} />
              <Route path="/verify-certificate" element={<CertificateVerification />} />
              
              {/* Course Routes */}
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/course/:courseId/learn" element={<CourseLearning />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<CourseManagement />} />
              <Route path="/admin/students" element={<StudentManagement />} />
              <Route path="/admin/assessments" element={<AssessmentManagement />} />
              <Route path="/admin/question-management" element={<QuestionManagementSystem />} />
              <Route path="/admin/certificates" element={<CertificateManagement />} />
              <Route path="/admin/events" element={<EventManagement />} />
              <Route path="/admin/payments" element={<PaymentReports />} />
              <Route path="/admin/study-materials" element={<StudyMaterialManagement />} />
              <Route path="/admin/study-materials/course/:courseId" element={<CourseMaterialsDetail />} />
              
              {/* Student Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/my-courses" element={<StudentCourses />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/payments" element={<StudentPayments />} />
              <Route path="/assessments" element={<StudentAssessments />} />
              <Route path="/student-certificates" element={<StudentCertificates />} />
              <Route path="/study-materials" element={<StudentStudyMaterials />} />
              <Route path="/learn/:courseId" element={<StudentCourseLearning />} />
              
              {/* Assessment Routes */}
              <Route path="/take-assessment/:assessmentId" element={<TakeAssessment />} />
              <Route path="/assessment-result/:attemptId" element={<AssessmentResult />} />
              <Route path="/assessment-history/:assessmentId" element={<AssessmentHistory />} />
              
              {/* Certificate Verification */}
              <Route path="/verify-certificate/:certificateNumber" element={<CertificateVerification />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
