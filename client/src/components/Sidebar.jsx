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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onOpenAddField, isMobile = false, onCloseMobile }) => {
  const { farmer, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { key: 'dashboard', name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { key: 'myFields', name: t('nav.myFields'), path: '/fields', icon: Trees },
    {
      key: 'addNewField',
      name: t('nav.addNewField'),
      action: onOpenAddField,
      icon: PlusCircle,
      isAction: true,
    },
    { key: 'cropPlanning', name: t('nav.cropPlanning'), path: '/crops', icon: Sprout },
    { key: 'aiCropAnalysis', name: t('nav.aiCropAnalysis'), path: '/analysis', icon: ScanEye, highlight: true },
    { key: 'analysisHistory', name: t('nav.analysisHistory'), path: '/history', icon: History },
    { key: 'profile', name: t('nav.profile'), path: '/profile', icon: UserCheck },
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
    <aside className="w-64 lg:w-72 bg-white border-r border-border-green flex flex-col h-full min-h-screen transition-all">
      {/* Brand Header */}
      <div className="p-5 lg:p-6 border-b border-border-green flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-green flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-light-sage" />
          </div>
          <div>
            <span className="text-lg font-bold font-heading text-forest-green tracking-tight">
              Farm<span className="text-fresh-green">Shield</span>
            </span>
            <span className="block text-[9px] uppercase tracking-wider text-muted-green font-medium">
              {t('common.workspace')}
            </span>
          </div>
        </NavLink>
      </div>

      {/* Farmer Profile Card mini */}
      <div className="p-3.5 mx-3.5 my-3.5 rounded-xl bg-soft-cream/70 border border-border-green/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-forest-green text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
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
                key={item.key}
                type="button"
                onClick={() => handleItemClick(item)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-forest-green bg-light-sage/40 hover:bg-light-sage transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-5 h-5 text-forest-green flex-shrink-0" />
                  <span className="leading-snug break-words">{item.name}</span>
                </div>
                <PlusCircle className="w-4 h-4 text-forest-green opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1" />
              </button>
            );
          }

          return (
            <NavLink
              key={item.key}
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
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive
                          ? 'text-light-sage'
                          : item.highlight
                          ? 'text-fresh-green'
                          : 'text-muted-green'
                      }`}
                    />
                    <span className="leading-snug break-words">{item.name}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[10px] font-semibold bg-light-sage text-forest-green px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1">
                      AI
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-light-sage flex-shrink-0 ml-1" />}
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
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>{t('nav.signOut')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
