import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LanguageSelector from '../components/LanguageSelector';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(t('auth.enterBothError', 'Please enter both email address and password.'));
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginFailed', 'Login failed. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Top Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20">
        <LanguageSelector />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-green flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-light-sage" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-bold font-heading text-forest-green tracking-tight">
              Farm<span className="text-fresh-green">Shield</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-muted-green font-medium">
              {t('auth.portalBadge', 'Farmer Access Portal')}
            </span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal">
          {t('auth.loginTitle', 'Sign In to Your Farm Dashboard')}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-green max-w-sm mx-auto leading-relaxed">
          {t('auth.loginSubtitle', 'Access your registered fields, crop health analyses, and agronomic guidance')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-card border border-border-green">
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.emailLabel', 'Farmer Email Address')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.passwordLabel', 'Password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 shadow-sm mt-2"
              loading={loading}
              icon={ArrowRight}
            >
              {t('auth.btnSignIn', 'Sign In to FarmShield')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-green text-center">
            <p className="text-xs text-muted-green leading-relaxed">
              {t('auth.noAccountPrompt', "Don't have an agricultural account yet?")}{' '}
              <Link to="/register" className="font-semibold text-forest-green hover:text-fresh-green transition-colors">
                {t('auth.registerTitle', 'Register as a Farmer')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
