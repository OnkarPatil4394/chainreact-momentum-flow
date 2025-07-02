
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import DevBlog from "./pages/DevBlog";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfUse from "./components/legal/TermsOfUse";
import AboutPage from "./components/legal/AboutPage";
import { db } from "@/db/database";

const queryClient = new QueryClient();

const App = () => {
  // Apply theme on app startup
  useEffect(() => {
    try {
      const settings = db.getSettings();
      applyTheme(settings.theme || 'default', settings.darkMode || false);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Apply default theme if there's an error
      applyTheme('default', false);
    }
  }, []);

  const applyTheme = (theme: string, darkMode: boolean) => {
    try {
      // Remove existing theme classes
      document.documentElement.classList.remove(
        'theme-default', 'theme-sage', 'theme-lavender', 
        'theme-peach', 'theme-ocean', 'theme-rose'
      );
      
      // Apply new theme class
      document.documentElement.classList.add(`theme-${theme}`);
      
      // Apply dark mode
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/dev-blog" element={<DevBlog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/app-info" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
