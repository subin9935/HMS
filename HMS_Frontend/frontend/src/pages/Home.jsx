import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Shield, 
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Activity,
  Stethoscope,
  CalendarCheck,
  FileText
} from 'lucide-react';

const Home = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'billing', label: 'Billing', icon: UserCheck },
  ];
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo Header */}
        <div className="h-16 flex items-center px-4 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold">HEALTH<span className="text-blue-400">CARE</span></h1>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-slate-700 ${
                      activeMenu === item.id ? 'bg-slate-700 border-r-2 border-blue-400' : ''
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeMenu === 'dashboard' ? 'Dashboard' : activeMenu}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <LogOut className="w-5 h-5 text-gray-600" />
             
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Patients</p>
                      <p className="text-3xl font-bold text-gray-900">2,847</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                      <p className="text-3xl font-bold text-gray-900">156</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-green-600">+5% from last month</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                      <p className="text-3xl font-bold text-gray-900">89</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CalendarCheck className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-blue-600">8 pending approval</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Insurance Claims</p>
                      <p className="text-3xl font-bold text-gray-900">1,247</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm text-orange-600">23 pending review</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-800">New patient registration: John Smith</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-800">Appointment confirmed with Dr. Williams</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-800">Insurance claim processed for patient #4521</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-800">Monthly report generated</p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeMenu === 'patients' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Management</h3>
              <p className="text-gray-600">Manage patient records, view medical history, and track treatment progress.</p>
            </div>
          )}
          
          {activeMenu === 'doctors' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Management</h3>
              <p className="text-gray-600">Manage doctor profiles, specializations, schedules, and availability.</p>
            </div>
          )}
          
          {activeMenu === 'appointments' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Scheduling</h3>
              <p className="text-gray-600">Schedule, reschedule, and manage patient appointments with doctors.</p>
            </div>
          )}
          
          {activeMenu === 'insurance' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Insurance Management</h3>
              <p className="text-gray-600">Process insurance claims, verify coverage, and manage billing.</p>
            </div>
          )}
          
          {activeMenu === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
              <p className="text-gray-600">Generate comprehensive reports and view analytics for better decision making.</p>
            </div>
          )}
          
          {activeMenu === 'billing' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Billing Management</h3>
              <p className="text-gray-600">Manage patient billing, payments, and financial records.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}



export default Home;