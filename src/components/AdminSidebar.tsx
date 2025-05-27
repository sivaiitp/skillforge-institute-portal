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
import { NavLink, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();

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
    <div className="w-64 bg-gray-100 min-h-screen py-4 px-2">
      <div className="font-bold text-xl mb-4 px-4">Admin Panel</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md hover:bg-gray-200 ${
                    isActive
                      ? "bg-gray-200 font-semibold"
                      : "text-gray-700"
                  }`
                }
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
