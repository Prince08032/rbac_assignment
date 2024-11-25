'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiSettings } from 'react-icons/fi';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => pathname === path;

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' || status === 'Active' ? 'bg-green-500' : 'bg-gray-500';
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-800 text-white
        w-64 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        z-40 flex flex-col
      `}>
        <div className="flex-1 p-4">
          {/* <h1 className="text-2xl font-bold mb-4">RBAC Admin</h1>
          <hr className="border-t border-gray-700 my-4"/> */}
          {/* User Info Section - Vertical Layout */}
          {user && (
            <div className="mb-6 text-center">
              {/* User Avatar Circle - Centered */}
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center font-semibold text-2xl mx-auto mb-3">
                {getInitial(user.name)}
              </div>
              
              {/* User Details - Stacked */}
              <div className="space-y-3">
                <div className="font-medium text-lg">{user.name}</div>
                
                {/* Roles Stack */}
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.isArray(user.roles) && user.roles.map((role, index) => (
                    <div 
                      key={index}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {role.name}
                    </div>
                  ))}
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(user.status)}`}></span>
                  <span className="capitalize">{user.status}</span>
                </div>
              </div>
            </div>
          )}

          <hr className="border-t border-gray-700 my-4"/>
          <nav className="space-y-4">
            <Link 
              href="/" 
              className={`flex items-center gap-2 p-2 rounded ${
                isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FiHome className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/userManage" 
              className={`flex items-center gap-2 p-2 rounded ${
                isActive('/userManage') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FiUsers className="h-5 w-5" />
              <span>Manage Users</span>
            </Link>
          </nav>
        </div>

        {/* Logout Button Container */}
        <div className="p-4 border-t border-gray-700">
          <LogoutButton />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar; 