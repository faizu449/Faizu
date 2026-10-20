import React, { useState, useEffect } from 'react';
import { PublicContentResponse } from './types.js';
import { api } from './services/api.js';
import { DEFAULT_PUBLIC_CONTENT } from './data/defaultContent.js';

// Client Experience Components
import { ClientLayout } from './components/client/ClientLayout.js';
import { Step1Landing } from './components/client/Step1Landing.js';
import { Step2Cake } from './components/client/Step2Cake.js';
import { Step3Balloons } from './components/client/Step3Balloons.js';
import { Step4Question } from './components/client/Step4Question.js';
import { Step5GiftBox } from './components/client/Step5GiftBox.js';
import { Step6GiftWishes } from './components/client/Step6GiftWishes.js';
import { Step7MemoriesIntro } from './components/client/Step7MemoriesIntro.js';
import { Step8MemoriesGallery } from './components/client/Step8MemoriesGallery.js';
import { Step9FinalWishes } from './components/client/Step9FinalWishes.js';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  
  // Instant synchronous startup with zero wait
  const [content, setContent] = useState<PublicContentResponse>(DEFAULT_PUBLIC_CONTENT);
  const [clientStep, setClientStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Sync browser path navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  // Only verify auth when accessing admin routes
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      const checkAuthStatus = async () => {
        const user = await api.checkAuth();
        setIsAuthenticated(!!user);
      };
      checkAuthStatus();
    }
  }, [currentPath]);

  // Load public surprise content in background without blocking initial paint
  const loadPublicContent = async () => {
    try {
      const res = await api.fetchPublicContent();
      setContent(res);
    } catch (err) {
      // Default content is already rendered
    }
  };

  useEffect(() => {
    loadPublicContent();
  }, []);

  // Handle Admin Routes
  if (currentPath === '/admin/login') {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
      return null;
    }
    return (
      <AdminLogin
        onSuccess={() => {
          setIsAuthenticated(true);
          navigate('/admin/dashboard');
        }}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  if (currentPath === '/admin/dashboard' || currentPath.startsWith('/admin')) {
    if (!isAuthenticated && !api.getToken()) {
      navigate('/admin/login');
      return null;
    }
    return (
      <AdminDashboard
        onLogout={async () => {
          await api.logout();
          setIsAuthenticated(false);
          navigate('/admin/login');
        }}
        onPreviewClient={() => {
          setClientStep(1);
          loadPublicContent();
          navigate('/');
        }}
      />
    );
  }

  const { settings, giftWishes, finalWishes, memories } = content;

  // Instant Client 9-Step Sequential Interactive Journey
  return (
    <ClientLayout
      currentStep={clientStep}
      totalSteps={9}
      onStepChange={(step) => setClientStep(step)}
    >
      {clientStep === 1 && (
        <Step1Landing
          settings={settings}
          onNext={() => setClientStep(2)}
        />
      )}

      {clientStep === 2 && (
        <Step2Cake
          settings={settings}
          onNext={() => setClientStep(3)}
        />
      )}

      {clientStep === 3 && (
        <Step3Balloons
          onNext={() => setClientStep(4)}
        />
      )}

      {clientStep === 4 && (
        <Step4Question
          settings={settings}
          onNext={() => setClientStep(5)}
        />
      )}

      {clientStep === 5 && (
        <Step5GiftBox
          onNext={() => setClientStep(6)}
        />
      )}

      {clientStep === 6 && (
        <Step6GiftWishes
          wishes={giftWishes}
          onNext={() => setClientStep(7)}
        />
      )}

      {clientStep === 7 && (
        <Step7MemoriesIntro
          settings={settings}
          onNext={() => setClientStep(8)}
        />
      )}

      {clientStep === 8 && (
        <Step8MemoriesGallery
          memories={memories}
          onNext={() => setClientStep(9)}
        />
      )}

      {clientStep === 9 && (
        <Step9FinalWishes
          settings={settings}
          finalWishes={finalWishes}
          onReplay={() => setClientStep(1)}
        />
      )}
    </ClientLayout>
  );
}
