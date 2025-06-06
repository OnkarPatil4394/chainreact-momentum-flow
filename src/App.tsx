
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import StreakCelebration from "./components/StreakCelebration";
import { db } from "./db/database";
import { playStreakSound } from "./utils/sounds";
import { backgroundSync } from "./utils/backgroundSync"; // Import background sync utility

// Legal & Info pages
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfUse from "./components/legal/TermsOfUse";
import Permissions from "./components/legal/Permissions";
import OpenSourceLicenses from "./components/legal/OpenSourceLicenses";
import AppVersionInfo from "./components/legal/AppVersionInfo";
import AboutPage from "./components/legal/AboutPage";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Add custom font to document head
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(linkElement);
    
    // Apply font to body
    document.body.classList.add('font-poppins');
    
    // Apply dark mode if enabled in settings
    const settings = db.getSettings();
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Initialize background sync
    backgroundSync.init();
    console.log('Background sync support:', backgroundSync.isSupported());
    console.log('Periodic sync support:', backgroundSync.isPeriodicSyncSupported());
    
    // Listen for sync events
    window.addEventListener('sync-complete', () => {
      console.log('Sync completed - UI can be refreshed');
    });
    
    window.addEventListener('app-updated', () => {
      console.log('App updated in background');
    });
    
    // Check if this is the first time opening the app
    const isFirstTime = db.isFirstTimeUser();
    if (isFirstTime) {
      setShowWelcome(true);
    } else {
      // Check for streak celebration
      checkForStreakCelebration();
    }
  }, []);

  // Function to check if we should show streak celebration
  const checkForStreakCelebration = () => {
    const stats = db.getStats();
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const today = new Date().toISOString().split('T')[0];
    
    // Check if it's a new day since last visit
    if (lastVisitDate && lastVisitDate !== today && stats.streakDays > 0) {
      setStreakDays(stats.streakDays);
      setShowStreakCelebration(true);
    }
    
    // Update last visit date
    localStorage.setItem('lastVisitDate', today);
  };

  const handleLoadingFinished = () => {
    setIsLoading(false);
  };
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    // Check streak after welcome screen closes
    checkForStreakCelebration();
  };
  
  const handleStreakCelebrationClose = () => {
    setShowStreakCelebration(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }
  
  if (showStreakCelebration) {
    return <StreakCelebration streakDays={streakDays} onClose={handleStreakCelebrationClose} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          className="dark:bg-gray-800 dark:text-white"
          toastOptions={{ duration: 3000 }}
        />
        
        {isLoading ? (
          <LoadingScreen onFinished={handleLoadingFinished} />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Legal & Info Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/opensource-licenses" element={<OpenSourceLicenses />} />
              <Route path="/app-info" element={<AppVersionInfo />} />
              <Route path="/about" element={<AboutPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
