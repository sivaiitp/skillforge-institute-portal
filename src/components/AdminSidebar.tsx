
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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const { signOut } = useAuth();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/courses", label: "Courses", icon: BookOpen },
    { path: "/admin/study-materials", label: "Study Materials", icon: FileText },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
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
    <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 backdrop-blur-sm border-r border-blue-100/50 shadow-2xl z-10 flex flex-col relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-blue-50/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none"></div>
      
      <div className="p-6 border-b border-blue-100/60 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-700 tracking-tight">Admin Panel</h2>
            <p className="text-xs text-slate-500 mt-0.5">Management Center</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 flex-1 overflow-y-auto relative z-10">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center p-3 rounded-xl transition-all duration-300 ease-in-out backdrop-blur-sm ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white shadow-lg shadow-blue-500/25 scale-[1.02] border border-blue-400/20"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-700 hover:shadow-lg hover:scale-[1.01] hover:border hover:border-blue-200/30"
                  }`
                }
              >
                <div className={`p-2 rounded-lg transition-colors duration-300 ${
                  ({ isActive }) => isActive ? "bg-white/20 shadow-inner" : "bg-white/40 group-hover:bg-white/60 shadow-sm"
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="ml-3 font-medium text-sm tracking-wide">{item.label}</span>
                <div className={`ml-auto w-1 h-6 rounded-full transition-all duration-300 ${
                  ({ isActive }) => isActive ? "bg-white/40 shadow-sm" : "bg-transparent"
                }`} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-100/60 backdrop-blur-sm relative z-10">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-start bg-white/50 border-slate-200 text-slate-600 hover:bg-red-50/80 hover:text-red-600 hover:border-red-200 transition-all duration-300 group backdrop-blur-sm"
        >
          <div className="p-1.5 rounded-lg bg-white/60 group-hover:bg-red-100/80 transition-colors duration-300 shadow-sm">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="ml-3 font-medium text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
