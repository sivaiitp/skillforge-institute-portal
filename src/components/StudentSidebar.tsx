
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  BookOpen, 
  Award, 
  User, 
  FileText, 
  CreditCard, 
  ClipboardList, 
  LogOut, 
  ExternalLink,
  GraduationCap
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview and quick stats"
  },
  {
    title: "My Courses",
    url: "/dashboard/courses",
    icon: BookOpen,
    description: "View enrolled courses"
  },
  {
    title: "Study Materials",
    url: "/dashboard/study-materials",
    icon: FileText,
    description: "Access course materials"
  },
  {
    title: "Assessments",
    url: "/dashboard/assessments",
    icon: ClipboardList,
    description: "Take tests and quizzes"
  },
  {
    title: "Certificates",
    url: "/dashboard/certificates",
    icon: Award,
    description: "View earned certificates"
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
    description: "Payment history and billing"
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    description: "Manage your profile"
  },
]

export function StudentSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut, user } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="p-3">
        {/* Logo/Brand */}
        <div 
          className="flex items-center space-x-2 mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-sm">RaceCodingInstitute</div>
            <div className="text-xs text-gray-500 flex items-center">
              <span>Go to website</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4 px-2">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-900 border border-blue-200">
            <User className="h-4 w-4" />
            <div className="flex-1 truncate text-sm font-medium">
              {user?.user_metadata?.first_name || 'Student'} {user?.user_metadata?.last_name || ''}
            </div>
          </div>
        </div>

        <h2 className="text-md font-semibold text-gray-800 mb-3">Student Menu</h2>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.url;
            
            return (
              <div
                key={item.url}
                className={cn(
                  "flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => navigate(item.url)}
              >
                <Icon className="w-4 h-4 mr-2" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.title}</div>
                  <div className="text-xs text-gray-500 truncate">{item.description}</div>
                </div>
              </div>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 mt-4 border-t border-gray-200 pt-3"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <div className="flex-1 text-left">
              <div className="font-medium text-sm">Logout</div>
              <div className="text-xs text-gray-500">Sign out of student portal</div>
            </div>
          </button>
        </nav>
      </div>
    </div>
  )
}
