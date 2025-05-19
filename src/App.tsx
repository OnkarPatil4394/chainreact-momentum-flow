
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
import { db } from "./db/database";

// Legal & Info pages
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfUse from "./components/legal/TermsOfUse";
import Permissions from "./components/legal/Permissions";
import OpenSourceLicenses from "./components/legal/OpenSourceLicenses";
import Changelog from "./components/legal/Changelog";
import AppVersionInfo from "./components/legal/AppVersionInfo";
import AboutPage from "./components/legal/AboutPage";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

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
    }
    
    // Check if this is the first time opening the app
    const isFirstTime = db.isFirstTimeUser();
    if (isFirstTime) {
      setShowWelcome(true);
    }
  }, []);

  const handleLoadingFinished = () => {
    setIsLoading(false);
  };
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
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
              <Route path="/changelog" element={<Changelog />} />
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
