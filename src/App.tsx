import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ServiceDetailsPage = lazy(() => import('./pages/ServiceDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const CreateServicePage = lazy(() => import('./pages/CreateServicePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  // Check authentication status on app load and route changes
  useEffect(() => {
    checkAuth();
  }, [checkAuth, location.pathname]);

  return (
    <Layout>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard/*" element={
            isAuthenticated ? <DashboardPage /> : <AuthPage initialTab="signin\" redirectPath="/dashboard" />
          } />
          <Route path="/messages/*" element={
            isAuthenticated ? <MessagesPage /> : <AuthPage initialTab="signin\" redirectPath="/messages" />
          } />
          <Route path="/create-service" element={
            isAuthenticated ? <CreateServicePage /> : <AuthPage initialTab="signin\" redirectPath="/create-service" />
          } />
          
          {/* Auth pages */}
          <Route path="/auth/:tab" element={<AuthPage />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;