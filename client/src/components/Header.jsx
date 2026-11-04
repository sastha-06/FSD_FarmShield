import React from 'react';
import { Plus, Calendar, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Header = ({ onOpenAddField, onToggleMobileSidebar, title, subtitle }) => {
  const { farmer } = useAuth();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border-green px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-deep-charcoal hover:bg-soft-cream border border-border-green"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-deep-charcoal">
              {title || `Welcome back, ${farmer?.name ? farmer.name.split(' ')[0] : 'Farmer'}! 👋`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-green mt-0.5">
              {subtitle || 'Here is what is happening across your registered fields today.'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Current Date Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-soft-cream border border-border-green text-xs font-medium text-deep-charcoal">
            <Calendar className="w-4 h-4 text-forest-green" />
            <span>{formattedDate}</span>
          </div>

          {/* Add Field Quick Action */}
          {onOpenAddField && (
            <Button
              onClick={onOpenAddField}
              variant="primary"
              size="sm"
              icon={Plus}
            >
              <span className="hidden sm:inline">Add Field</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
