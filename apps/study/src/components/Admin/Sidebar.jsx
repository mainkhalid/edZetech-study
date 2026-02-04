import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdClass,
  MdSchool,
  MdSettings,
  MdLogout,
  MdMenuOpen,
  MdMenu,
  MdHistory,
  MdHelpCenter,
  MdAutoGraph
} from 'react-icons/md';
import { SiSemanticscholar } from 'react-icons/si';
import { logo } from '../../assets';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard />, path: '/admin/dashboard' },
    { id: 'programmes', label: 'Programmes', icon: <MdClass />, path: '/admin/programmes' },
    { id: 'scholarships', label: 'Scholarships', icon: <SiSemanticscholar />, path: '/admin/scholars' },
    { id: 'admissions', label: 'Admissions', icon: <MdSchool />, path: '/admin/admissions' },
    { id: 'research', label: 'Research', icon: <MdAutoGraph />, path: '/admin/research' },
    { id: 'faqs', label: 'FAQs', icon: <MdHelpCenter />, path: '/admin/faqadmin' },
     { id: 'history', label: 'History', icon: <MdHistory />, path: '/admin/history' },
  ];

  return (
    <div
      className={`flex flex-col bg-gradient-to-b from-[#1a2b4c] to-[#3b4d6e] text-white transition-all duration-300 shadow-2xl h-screen fixed ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between">
        {!isCollapsed && (
          <img
            src={logo.zetlogo}
            alt="Zetech Logo"
            className="h-12 w-auto rounded-md"
          />
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
        >
          {isCollapsed ? (
            <MdMenu size={22} className="text-blue-300" />
          ) : (
            <MdMenuOpen size={22} className="text-blue-300" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-blue-900/40 border-l-4 border-blue-400'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <div
              className={({ isActive }) =>
                `p-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-200'
                    : 'group-hover:bg-white/10 group-hover:text-blue-300'
                }`
              }
            >
              {React.cloneElement(item.icon, { size: 22 })}
            </div>

            {!isCollapsed && (
              <span className="font-medium tracking-tight">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <MdSettings size={20} />
          {!isCollapsed && <span className="font-medium">System Settings</span>}
        </NavLink>

        <button
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-300 hover:bg-red-400/10 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <MdLogout size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
