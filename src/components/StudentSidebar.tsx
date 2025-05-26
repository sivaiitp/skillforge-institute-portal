
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

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Courses",
    url: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Study Materials",
    url: "/dashboard/study-materials",
    icon: FileText,
  },
  {
    title: "Assessments",
    url: "/dashboard/assessments",
    icon: ClipboardList,
  },
  {
    title: "Certificates",
    url: "/dashboard/certificates",
    icon: Award,
  },
  {
    title: "Payments",
    url: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> 
              <span>Student Portal</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mb-4 px-3 py-2">
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-2 text-blue-900">
                <User className="h-4 w-4" />
                <div className="flex-1 truncate text-sm font-medium">
                  {user?.user_metadata?.first_name || 'Student'} {user?.user_metadata?.last_name || ''}
                </div>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" onClick={(e) => {
                    e.preventDefault()
                    navigate('/')
                  }}>
                    <ExternalLink />
                    <span>Go to Main Site</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <a href={item.url} onClick={(e) => {
                      e.preventDefault()
                      navigate(item.url)
                    }}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
