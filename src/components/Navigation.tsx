
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Events", href: "/events" },
    { name: "Career Guidance", href: "/career" },
    { name: "Contact", href: "/contact" },
    { name: "Verify Certificate", href: "/verify-certificate" },
  ];

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...');
      await signOut();
      console.log('Sign out successful');
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  // Get the first name from user metadata, fallback to email
  const getDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email || '';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-800">RaceCodingInstitute</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{getDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile ({userRole})</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {userRole === 'admin' ? (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>My Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 border-t mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {getDisplayName()} ({userRole})
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  Profile
                </Button>
                {userRole === 'admin' ? (
                  <Button 
                    variant="outline" 
                    className="w-full mb-2"
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full mb-2"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                  >
                    My Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
