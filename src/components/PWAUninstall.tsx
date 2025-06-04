
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Smartphone, Monitor, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAUninstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is installed
    const checkInstallStatus = () => {
      // Check if running in standalone mode (PWA installed)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast({
          title: 'App installed successfully',
          description: 'ChainReact has been added to your device',
          duration: 3000,
        });
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation failed:', error);
      toast({
        title: 'Installation failed',
        description: 'Unable to install the app. Please try again.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleUninstall = () => {
    // Since there's no direct uninstall API, provide instructions
    const userAgent = navigator.userAgent;
    let instructions = '';

    if (userAgent.includes('Chrome') || userAgent.includes('Edge')) {
      instructions = 'Go to Settings → Apps → ChainReact → Uninstall, or right-click the app icon and select "Uninstall"';
    } else if (userAgent.includes('Firefox')) {
      instructions = 'Go to about:about → Installed Web Apps → Remove ChainReact';
    } else if (userAgent.includes('Safari')) {
      instructions = 'Go to Home Screen → Long press ChainReact → Remove App';
    } else {
      instructions = 'Check your device\'s app management settings to uninstall ChainReact';
    }

    toast({
      title: 'Uninstall Instructions',
      description: instructions,
      duration: 8000,
    });
  };

  return (
    <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">PWA Management</h3>
      
      {isInstalled ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start dark:bg-green-900/30 dark:border-green-900">
            <Smartphone size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">App is installed</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ChainReact is running as a Progressive Web App on your device
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleUninstall}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            <Trash size={16} className="mr-2" />
            Uninstall App
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {deferredPrompt ? (
            <div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start dark:bg-blue-900/30 dark:border-blue-900 mb-3">
                <Monitor size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Install as App</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Install ChainReact for a native app experience
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleInstall}
                className="flex items-center"
              >
                <Smartphone size={16} className="mr-2" />
                Install App
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-start dark:bg-gray-800 dark:border-gray-700">
              <AlertCircle size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Installation not available</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Your browser doesn't support PWA installation or the app is already installed
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PWAUninstall;
