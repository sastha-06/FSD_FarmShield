import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, farmer, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border-green transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl bg-forest-green flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-light-sage" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading text-forest-green tracking-tight flex items-center gap-1">
                Farm<span className="text-fresh-green">Shield</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-muted-green font-medium -mt-1">
                AgriTech AI Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              How It Works
            </a>
            <a href="/#why-farmshield" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              Why FarmShield
            </a>
            <a href="/#about" className="text-sm font-medium text-deep-charcoal hover:text-forest-green transition-colors">
              About
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="sage" size="sm" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-3 border-l border-border-green">
                  <div className="w-8 h-8 rounded-full bg-forest-green text-white flex items-center justify-center text-xs font-bold">
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
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-deep-charcoal hover:bg-light-sage/30 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border-green bg-white px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 pt-2">
            <a
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              How It Works
            </a>
            <a
              href="/#why-farmshield"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              Why FarmShield
            </a>
            <a
              href="/#about"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-deep-charcoal hover:bg-soft-cream"
            >
              About
            </a>
          </div>

          <div className="pt-4 border-t border-border-green flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full" icon={LayoutDashboard}>
                    Go to Dashboard
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
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Get Started Free
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
