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
  CreditCard, 
  ClipboardList, 
  LogOut, 
  ExternalLink,
  GraduationCap
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthProvider"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    description: "Overview and quick stats"
  },
  {
    title: "My Courses",
    url: "/my-courses",
    icon: BookOpen,
    description: "View enrolled courses"
  },
  {
    title: "Assessments",
    url: "/assessments",
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
    url: "/payments",
    icon: CreditCard,
    description: "Payment history and billing"
  },
  {
    title: "Profile",
    url: "/profile",
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
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          {/* Logo/Brand */}
          <div 
            className="flex items-center space-x-3 mb-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sidebar-foreground">RaceCodingInstitute</div>
              <div className="text-xs text-sidebar-foreground/70 flex items-center">
                <span>Go to website</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-3 px-2">
            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-blue-900 border border-blue-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {user?.user_metadata?.first_name || 'Student'} {user?.user_metadata?.last_name || ''}
                </div>
                <div className="text-xs text-blue-700/70 truncate">Student Portal</div>
              </div>
            </div>
          </div>

          <SidebarGroupLabel className="px-4 mb-1 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wide">
            Student Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      isActive={isActive}
                      className="w-full justify-start h-10 px-4 mb-0.5 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-900 data-[active=true]:border-blue-200 data-[active=true]:shadow-sm group"
                    >
                      <Icon className="w-5 h-5 mr-3 group-data-[active=true]:text-blue-600" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-sidebar-foreground/60 group-data-[active=true]:text-blue-700/70">
                          {item.description}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="w-full justify-start h-10 px-4 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">Logout</div>
                <div className="text-xs text-red-500/70">Sign out of student portal</div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
