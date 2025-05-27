
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  Award,
  Users,
  LogOut,
  Home,
  HelpCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const { signOut } = useAuth();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/", label: "Home Page", icon: Home },
    { path: "/admin/courses", label: "Courses", icon: BookOpen },
    { path: "/admin/study-materials", label: "Study Materials", icon: FileText },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
    { path: "/admin/question-management", label: "Question Management", icon: HelpCircle },
    { path: "/admin/certificates", label: "Certificates", icon: Award },
    { path: "/admin/events", label: "Events", icon: Calendar },
    { path: "/admin/payments", label: "Payment Reports", icon: CreditCard },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-0.5">Management Center</p>
          </div>
        </div>
      </div>
      
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-0.5">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center p-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                      isActive ? "bg-white/20" : "bg-gray-200"
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="ml-3 font-medium text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-start text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
        >
          <div className="p-1.5 rounded-lg bg-gray-100 mr-3 transition-colors duration-200">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
