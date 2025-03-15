import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  User, 
  Users, 
  List, 
  Database, 
  LogOut, 
  Menu, 
  X, 
  CircleParking,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const securityNavItems = [
    { path: '/', icon: <CircleParking className="h-5 w-5" />, label: 'Empty Slots' },
    { path: '/request', icon: <Car className="h-5 w-5" />, label: 'Request Entry' },
  ];

  const adminNavItems = [
    { path: '/', icon: <Database className="h-5 w-5" />, label: 'Add Entry' },
    { path: '/approvals', icon: <List className="h-5 w-5" />, label: 'Approvals' },
  ];

  const superuserNavItems = [
    { path: '/', icon: <ArrowDown className="h-5 w-5" />, label: 'Occupancy' },
    { path: '/overstay', icon: <Car className="h-5 w-5" />, label: 'Overstay Vehicles' },
    { path: '/approvals', icon: <List className="h-5 w-5" />, label: 'Pending Approvals' },
  ];

  let navItems;
  if (currentUser?.role === 'security') {
    navItems = securityNavItems;
  } else if (currentUser?.role === 'admin') {
    navItems = adminNavItems;
  } else {
    navItems = superuserNavItems;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 transform bg-white shadow-lg transition-transform duration-300 ease-in-out z-20 w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center space-x-2">
              <CircleParking className="h-6 w-6 text-parking-highlight" />
              <span className="text-xl font-bold">Parking Pulse</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    location.pathname === item.path
                      ? "bg-parking-highlight text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {currentUser ? getInitials(currentUser.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role || "Guest"}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-10 bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(sidebarOpen ? "md:hidden" : "")}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                Role: <span className="font-semibold capitalize">{currentUser?.role || "Guest"}</span>
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
