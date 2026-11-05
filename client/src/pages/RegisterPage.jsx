import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LanguageSelector from '../components/LanguageSelector';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError(t('auth.requiredFieldsError', 'Full name, email, and password are required.'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passLengthError', 'Password must be at least 6 characters.'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passMismatchError', 'Passwords do not match.'));
      return;
    }

    try {
      setLoading(true);
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword,
        formData.phone.trim()
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('auth.registerFailed', 'Registration failed. Please try again.'));
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
              {t('auth.portalBadge', 'New Farmer Registration')}
            </span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-deep-charcoal">
          {t('auth.registerTitle', 'Create Your FarmShield Account')}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-green max-w-sm mx-auto leading-relaxed">
          {t('auth.registerSubtitle', 'Join thousands of farmers making smarter, AI-assisted agricultural decisions')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-card border border-border-green">
          {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.fullNameLabel', 'Full Name')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <User className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.emailLabel', 'Email Address')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.phoneLabel', 'Phone Number (Optional)')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.passwordLabel', 'Password')} * (min 6 characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-deep-charcoal mb-1.5">
                {t('auth.confirmPasswordLabel', 'Confirm Password')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-green">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border-green focus:border-forest-green focus:ring-1 focus:ring-forest-green text-sm bg-soft-cream/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 shadow-sm mt-4"
              loading={loading}
              icon={ArrowRight}
            >
              {t('auth.btnSignUp', 'Complete Registration')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-green text-center">
            <p className="text-xs text-muted-green leading-relaxed">
              {t('auth.haveAccountPrompt', 'Already have an account?')}{' '}
              <Link to="/login" className="font-semibold text-forest-green hover:text-fresh-green transition-colors">
                {t('auth.btnSignIn', 'Sign In')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
