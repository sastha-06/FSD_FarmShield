import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  LogOut,
  CheckCircle2,
  Save,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Alert from '../components/Alert';

const ProfilePage = () => {
  const { farmer, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Edit State
  const [name, setName] = useState(farmer?.name || '');
  const [phone, setPhone] = useState(farmer?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!name.trim()) {
      setProfileMsg({ type: 'error', text: 'Full name cannot be blank.' });
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile(name.trim(), phone.trim());
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile details.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);

    if (!currentPassword || !newPassword) {
      setPassMsg({ type: 'error', text: 'Please fill out all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setChangingPass(true);
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      setPassMsg({ type: 'success', text: 'Your password has been changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPassMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setChangingPass(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-border-green flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-forest-green flex items-center gap-2">
            <User className="w-6 h-6 text-fresh-green" /> Farmer Account Profile
          </h2>
          <p className="text-xs sm:text-sm text-muted-green mt-0.5">
            Manage your personal credentials, contact numbers, and security credentials
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={handleSignOut} icon={LogOut}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Identity Card */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-forest-green text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-md">
              {farmer?.name ? farmer.name.charAt(0).toUpperCase() : 'F'}
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading text-deep-charcoal">
                {farmer?.name}
              </h3>
              <p className="text-xs text-muted-green">{farmer?.email}</p>
              <Badge variant="success" size="sm" className="mt-2">
                Active Agricultural Account
              </Badge>
            </div>

            <div className="pt-4 border-t border-border-green text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-green flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest-green" /> Phone:
                </span>
                <span className="font-semibold text-deep-charcoal">
                  {farmer?.phone || 'Not recorded'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-green flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-forest-green" /> Member Since:
                </span>
                <span className="font-semibold text-deep-charcoal">
                  {farmer?.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : 'Active Member'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (7 cols): Edit Profile & Change Password */}
        <div className="md:col-span-7 space-y-8">
          {/* Form 1: Update Profile */}
          <Card className="p-6 space-y-5">
            <h4 className="text-base font-bold font-heading text-forest-green flex items-center gap-2">
              <User className="w-4 h-4 text-fresh-green" /> Update Personal Information
            </h4>

            {profileMsg && (
              <Alert
                type={profileMsg.type}
                message={profileMsg.text}
                onClose={() => setProfileMsg(null)}
              />
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green focus:border-forest-green"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Email Address (Immutable)
                </label>
                <input
                  type="email"
                  value={farmer?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green bg-soft-cream/60 text-muted-green cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green focus:border-forest-green"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={savingProfile}
                icon={Save}
              >
                Save Profile Changes
              </Button>
            </form>
          </Card>

          {/* Form 2: Change Password */}
          <Card className="p-6 space-y-5">
            <h4 className="text-base font-bold font-heading text-forest-green flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-fresh-green" /> Change Password
            </h4>

            {passMsg && (
              <Alert
                type={passMsg.type}
                message={passMsg.text}
                onClose={() => setPassMsg(null)}
              />
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green focus:border-forest-green"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green focus:border-forest-green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-deep-charcoal mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-border-green focus:border-forest-green"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="sage"
                size="sm"
                loading={changingPass}
                icon={Lock}
              >
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
