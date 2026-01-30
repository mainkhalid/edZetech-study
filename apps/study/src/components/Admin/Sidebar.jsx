import React, { useState } from 'react';
import { MdDashboard, MdClass, MdPeople, MdSchool, MdSettings, MdLogout, MdMenuOpen, MdMenu, MdHistory, MdHelpCenter, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import {logo} from '../../assets';

const Sidebar = ({ activePage = 'programmes' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard />, path: '/admin/dashboard' },
    { 
      id: 'programmes', 
      label: 'Programmes', 
      icon: <MdClass />, 
      path: '/admin/programmes',
      badge: 'New'
    },
    { id: 'scholarships', label: 'Scholarships', icon: <MdPeople />, path: '/admin/scholars' },
    { id: 'admissions', label: 'Admissions', icon: <MdSchool />, path: '/admin/admissions' },
    { id: 'faqs', label: 'FAQs', icon: <MdHelpCenter />, path: '/admin/faqadmin' },
    { id: 'history', label: 'History', icon: <MdHistory />, path: '/admin/history' },
  ];

  // Accessible toggle labels
  const toggleLabel = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <div 
      className={`flex flex-col bg-gradient-to-b from-[#1a2b4c] to-[#0f1a2d] text-white transition-all duration-300 shadow-2xl h-screen fixed ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Main navigation"
    >
      {/* Brand Header */}
<div className="p-5 flex items-center justify-between">
  {/* Logo */}
  <img
    src={logo.zetlogo}
    alt="Zetech Logo"
    className="h-12 w-auto rounded-md"
  />

  
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    aria-label={toggleLabel}
    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
  >
    {isCollapsed ? (
      <MdMenu size={22} className="text-blue-300" />
    ) : (
      <MdMenuOpen size={22} className="text-blue-300" />
    )}
  </button>
</div>


      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <a
              key={item.id}
              href={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/40 border-l-3 border-blue-400'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Icon Container with Active State Glow */}
              <div className={`p-1.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/20' 
                  : 'group-hover:bg-white/10 group-hover:text-blue-300'
              }`}>
                {React.cloneElement(item.icon, { 
                  size: 22,
                  className: "transition-all"
                })}
              </div>
              
              {!isCollapsed && (
                <>
                  <span className="font-medium tracking-tight">{item.label}</span>
                  
                  {/* Enhanced Badge */}
                  {item.badge && (
                    <span className="ml-auto bg-gradient-to-r from-orange-500 to-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-tight shadow-md">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Subtle Active Indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* Settings Button */}
        <button 
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          aria-label="System settings"
        >
          <div className="p-1.5 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-all">
            <MdSettings size={20} />
          </div>
          {!isCollapsed && <span className="font-medium">System Settings</span>}
        </button>
        
        {/* User Profile Card */}
        <div 
          className={`mt-1 p-2.5 rounded-xl bg-gradient-to-r from-slate-800/70 to-slate-900/50 border border-slate-700/50 flex items-center gap-3 ${
            isCollapsed ? 'justify-center py-3' : ''
          }`}
          aria-label="User profile"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-600 shadow-lg">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Admin profile" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {!isCollapsed && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f1a2d]"></div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">D. Kiptoo</p>
              <p className="text-[11px] text-slate-400 truncate">Registrar</p>
            </div>
          )}
          
          {!isCollapsed && (
            <button 
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              aria-label="Logout"
            >
              <MdLogout size={18} />
            </button>
          )}
        </div>
        
        {/* Collapsed State Profile Tooltip */}
        {isCollapsed && (
          <div className="absolute bottom-24 left-full ml-2 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700">
            D. Kiptoo • Registrar
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;