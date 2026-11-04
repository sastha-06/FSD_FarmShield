import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trees,
  PlusCircle,
  Sprout,
  ScanEye,
  History,
  UserCheck,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onOpenAddField, isMobile = false, onCloseMobile }) => {
  const { farmer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Fields', path: '/fields', icon: Trees },
    {
      name: 'Add New Field',
      action: onOpenAddField,
      icon: PlusCircle,
      isAction: true,
    },
    { name: 'Crop Planning', path: '/crops', icon: Sprout },
    { name: 'AI Crop Analysis', path: '/analysis', icon: ScanEye, highlight: true },
    { name: 'Analysis History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: UserCheck },
  ];

  const handleItemClick = (item) => {
    if (item.isAction && item.action) {
      item.action();
    }
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-border-green flex flex-col h-full min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-border-green flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-green flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5 text-light-sage" />
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-forest-green tracking-tight">
              Farm<span className="text-fresh-green">Shield</span>
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-muted-green font-medium">
              AgriTech Workspace
            </span>
          </div>
        </NavLink>
      </div>

      {/* Farmer Profile Card mini */}
      <div className="p-4 mx-4 my-4 rounded-xl bg-soft-cream/70 border border-border-green/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-forest-green text-white flex items-center justify-center font-bold text-sm">
          {farmer?.name ? farmer.name.charAt(0).toUpperCase() : 'F'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-deep-charcoal truncate">
            {farmer?.name || 'Farmer'}
          </p>
          <p className="text-xs text-muted-green truncate">
            {farmer?.email || 'Registered User'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-forest-green bg-light-sage/40 hover:bg-light-sage transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-forest-green" />
                  <span>{item.name}</span>
                </div>
                <PlusCircle className="w-4 h-4 text-forest-green opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => handleItemClick(item)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-forest-green text-white shadow-sm'
                    : item.highlight
                    ? 'text-forest-green hover:bg-light-sage/30'
                    : 'text-deep-charcoal/80 hover:bg-soft-cream hover:text-deep-charcoal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-light-sage'
                          : item.highlight
                          ? 'text-fresh-green'
                          : 'text-muted-green'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[10px] font-semibold bg-light-sage text-forest-green px-1.5 py-0.5 rounded-md">
                      AI
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-light-sage" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-border-green">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-error-red hover:bg-[#FDF0EE] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
