
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  Award,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
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

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 shadow-sm z-10">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
