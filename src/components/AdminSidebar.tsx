
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  BookOpen,
  FileText,
  Award,
  DollarSign,
  BarChart3,
  Home
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin',
      description: 'Overview and quick actions'
    },
    {
      title: 'Student Management',
      icon: Users,
      href: '/admin/students',
      description: 'View and manage student details'
    },
    {
      title: 'Course Management',
      icon: BookOpen,
      href: '/admin/courses',
      description: 'Add/edit/remove courses'
    },
    {
      title: 'Assessment Management',
      icon: FileText,
      href: '/admin/assessments',
      description: 'Add/edit/remove online assessments'
    },
    {
      title: 'Certification Management',
      icon: Award,
      href: '/admin/certificates',
      description: 'Issue and validate certificates'
    },
    {
      title: 'Payment & Reports',
      icon: DollarSign,
      href: '/admin/reports',
      description: 'Financial reports and analytics'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 pt-20 z-40">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Admin Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
