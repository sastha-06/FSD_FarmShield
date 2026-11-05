import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import api from './services/api';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyFieldsPage from './pages/MyFieldsPage';
import CropPlanningPage from './pages/CropPlanningPage';
import CropAnalysisPage from './pages/CropAnalysisPage';
import AnalysisHistoryPage from './pages/AnalysisHistoryPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FieldModal from './components/FieldModal';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';

const ProtectedLayout = ({ children, onOpenAddField, onEditField }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: null, subtitle: null };
      case '/fields':
        return {
          title: t('fields.title'),
          subtitle: t('fields.subtitle'),
        };
      case '/crops':
        return {
          title: t('cropPlanning.title'),
          subtitle: t('cropPlanning.subtitle'),
        };
      case '/analysis':
        return {
          title: t('cropAnalysis.title'),
          subtitle: t('cropAnalysis.subtitle'),
        };
      case '/history':
        return {
          title: t('history.title'),
          subtitle: t('history.subtitle'),
        };
      case '/profile':
        return {
          title: t('profile.title'),
          subtitle: t('profile.subtitle'),
        };
      default:
        return { title: null, subtitle: null };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div className="min-h-screen bg-soft-cream flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenAddField={onOpenAddField} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-white h-full shadow-2xl">
            <Sidebar
              onOpenAddField={onOpenAddField}
              isMobile
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddField={onOpenAddField}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, onOpenAddField, onEditField }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <LoadingSpinner text="Checking authentication status..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ProtectedLayout onOpenAddField={onOpenAddField} onEditField={onEditField}>
      {children}
    </ProtectedLayout>
  );
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editFieldData, setEditFieldData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAddField = () => {
    setEditFieldData(null);
    setFieldModalOpen(true);
  };

  const handleOpenEditField = (field) => {
    setEditFieldData(field);
    setFieldModalOpen(true);
  };

  const handleSaveField = async (formData, fieldId) => {
    if (fieldId) {
      await api.put(`/fields/${fieldId}`, formData);
    } else {
      await api.post('/fields', formData);
    }
    // Trigger component refresh
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Farmer SaaS Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <DashboardPage key={refreshKey} onOpenAddField={handleOpenAddField} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <MyFieldsPage
                key={refreshKey}
                onOpenAddField={handleOpenAddField}
                onEditField={handleOpenEditField}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crops"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <CropPlanningPage key={refreshKey} onOpenAddField={handleOpenAddField} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <CropAnalysisPage key={refreshKey} onOpenAddField={handleOpenAddField} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <AnalysisHistoryPage key={refreshKey} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              onOpenAddField={handleOpenAddField}
              onEditField={handleOpenEditField}
            >
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Field Registration & Edit Modal */}
      <FieldModal
        isOpen={fieldModalOpen}
        onClose={() => {
          setFieldModalOpen(false);
          setEditFieldData(null);
        }}
        onSave={handleSaveField}
        editData={editFieldData}
      />

      {/* Global Multilingual AI Farmer Assistant Chatbot */}
      <Chatbot />
    </>
  );
};

export default App;
