import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  Shield, 
  Stethoscope, 
  FileText,
  Activity,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Search,
  Lock
} from 'lucide-react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const username = userInfo.username || 'User';
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

   const handleChangePassword = () => {
    setDropdownOpen(false);
    navigate('/change-password');
    
  };
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/' },
    { id: 'patients', label: 'Patients', icon: Users, path: '/patients' },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, path: '/doctors' },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck, path: '/appointments' },
    { id: 'insurance', label: 'Insurance', icon: Shield, path: '/insurance' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { id: 'billing', label: 'Billing', icon: UserCheck, path: '/billing' },
    { id: 'logout', label: 'Logout', icon: LogOut, action :handleLogout },
  ];

  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center px-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && <h1 className="text-lg font-bold">HEALTH<span className="text-blue-400">CARE</span></h1>}
          </div>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <button
                     onClick={() => {
                      if (item.action) {
                          item.action(); // call the function
                      } else if (item.path) {
                           navigate(item.path); // navigate if path exists
                      }
                 }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-slate-700 ${
                      isActive ? 'bg-slate-700 border-r-2 border-blue-400' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400">
              © 2025 Healthcare System
              <br />
              All Rights Reserved
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-gray-100 rounded">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

           
            {/* User Profile with Dropdown */}
            <div className="relative">
              <div className="flex items-center space-x-3" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Welcome! {username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button onClick={handleChangePassword}  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                     <Lock className="w-5 h-5 text-gray-600 mr-2" /> Change Password
                  </button>
                
                  <button
                    onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                  <LogOut className="w-5 h-5 text-gray-600 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Render page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;