import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, LayoutDashboard, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, farmer, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-green transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-forest-green flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-light-sage" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-forest-green tracking-tight flex items-center gap-1">
                Farm<span className="text-fresh-green">Shield</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-green font-medium -mt-1">
                {t('common.appSubname')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="/#features" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              {t('nav.features')}
            </a>
            <a href="/#how-it-works" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              {t('nav.howItWorks')}
            </a>
            <a href="/#why-farmshield" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              {t('nav.whyFarmShield')}
            </a>
            <a href="/#about" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              {t('nav.about')}
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Global Language Selector */}
            <LanguageSelector variant="nav" />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="sage" size="sm" icon={LayoutDashboard}>
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-border-green">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {farmer?.name ? farmer.name.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <span className="text-sm font-medium text-deep-charcoal truncate max-w-[120px]">
                    {farmer?.name}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu and Language selector button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector variant="nav" />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-deep-charcoal hover:bg-light-sage/30 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border-green bg-white px-4 pt-2 pb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-2 pt-2">
            <a
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              {t('nav.features')}
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              {t('nav.howItWorks')}
            </a>
            <a
              href="/#why-farmshield"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              {t('nav.whyFarmShield')}
            </a>
            <a
              href="/#about"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              {t('nav.about')}
            </a>
          </div>

          <div className="pt-4 border-t border-border-green flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full" icon={LayoutDashboard}>
                    {t('nav.dashboard')}
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2 text-sm text-error-red font-medium"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
