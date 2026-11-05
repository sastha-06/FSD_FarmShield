import React from 'react';
import { Plus, Calendar, Bell, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../i18n';
import Button from './Button';
import LanguageSelector from './LanguageSelector';

const Header = ({ onOpenAddField, onToggleMobileSidebar, title, subtitle }) => {
  const { farmer } = useAuth();
  const { t, i18n } = useTranslation();

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === (i18n.language || 'en')) || SUPPORTED_LANGUAGES[0];

  const formattedDate = new Date().toLocaleDateString(currentLang.locale || 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const firstName = farmer?.name ? farmer.name.split(' ')[0] : '';
  const defaultTitle = firstName
    ? t('header.welcomeBack', { name: firstName })
    : t('header.welcomeDefault');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border-green px-4 sm:px-6 lg:px-8 py-4 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left Welcome */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-deep-charcoal hover:bg-soft-cream border border-border-green flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold font-heading text-deep-charcoal leading-tight truncate">
              {title || defaultTitle}
            </h1>
            <p className="text-xs sm:text-sm text-muted-green mt-0.5 line-clamp-1">
              {subtitle || t('header.subtitleDefault')}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Global Language Selector */}
          <LanguageSelector variant="header" />

          {/* Current Date Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-soft-cream border border-border-green text-xs font-medium text-deep-charcoal">
            <Calendar className="w-4 h-4 text-forest-green flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          {/* Add Field Quick Action */}
          {onOpenAddField && (
            <Button
              onClick={onOpenAddField}
              variant="primary"
              size="sm"
              icon={Plus}
              className="flex-shrink-0"
            >
              <span>{t('header.addField')}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
