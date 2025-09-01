import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b32626aaf5224b2997f59c8342dadcb5',
  appName: 'chainreact-momentum-flow',
  webDir: 'dist',
  server: {
    url: 'https://b32626aa-f522-4b29-97f5-9c8342dadcb5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: '#000000',
      style: 'dark'
    }
  }
};

export default config;