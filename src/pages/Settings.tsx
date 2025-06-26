
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import PWAUninstall from '../components/PWAUninstall';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '../db/database';
import { secureStorage } from '../utils/secureStorage';
import { AppSettings } from '../types/types';
import { useToast } from "@/hooks/use-toast";
import { playSettingsSound } from '../utils/sounds';
import { 
  Save, 
  Download, 
  Upload, 
  Trash, 
  AlertCircle, 
  ChevronRight,
  FileText,
  Shield,
  Info,
  Code2,
  Settings as SettingsIcon,
  Palette,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const { toast } = useToast();
  
  useEffect(() => {
    setSettings(db.getSettings());
    
    // Apply dark mode based on saved setting
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const handleToggleNotifications = () => {
    const updatedSettings = {
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled
    };
    setSettings(updatedSettings);
    db.saveSettings(updatedSettings);
    
    playSettingsSound();
    
    toast({
      title: updatedSettings.notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled',
      description: updatedSettings.notificationsEnabled 
        ? 'You will receive habit reminders' 
        : 'You will not receive habit reminders',
      duration: 3000,
    });
  };
  
  const handleToggleDarkMode = () => {
    const updatedSettings = {
      ...settings,
      darkMode: !settings.darkMode
    };
    setSettings(updatedSettings);
    db.saveSettings(updatedSettings);
    
    if (updatedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    playSettingsSound();
    
    toast({
      title: updatedSettings.darkMode ? 'Dark mode enabled' : 'Light mode enabled',
      duration: 3000,
    });
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = {
      ...settings,
      reminderTime: e.target.value
    };
    setSettings(updatedSettings);
    db.saveSettings(updatedSettings);
    
    playSettingsSound();
  };
  
  const handleExportData = () => {
    try {
      const data = db.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chainreact-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      playSettingsSound();
      
      toast({
        title: 'Data exported successfully',
        description: 'Your habits and progress have been saved to a file',
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export failed',
        description: 'There was a problem exporting your data',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = db.importData(jsonData);
        
        if (success) {
          setSettings(db.getSettings());
          
          const updatedSettings = db.getSettings();
          if (updatedSettings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          playSettingsSound();
          
          toast({
            title: 'Data imported successfully',
            description: 'Your habits and progress have been restored',
            duration: 3000,
          });
        } else {
          toast({
            title: 'Import failed',
            description: 'Invalid backup file format',
            variant: 'destructive',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: 'Import failed',
          description: 'There was a problem importing your data',
          variant: 'destructive',
          duration: 3000,
        });
      }
    };
    
    reader.readAsText(file);
    e.target.value = '';
  };
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      secureStorage.clear();
      setSettings(db.getSettings());
      
      playSettingsSound();
      
      toast({
        title: 'Data reset complete',
        description: 'All habits and progress have been cleared',
        duration: 3000,
      });
    }
  };
  
  const SettingsLink = ({ to, icon, title, description }: { to: string, icon: React.ReactNode, title: string, description: string }) => (
    <Link to={to}>
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <div className="flex items-start">
          <div className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
            {icon}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
      </div>
    </Link>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <SettingsIcon className="mr-3 text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customize ChainReact to your preferences</p>
        </div>
        
        <div className="space-y-6">
          {/* PWA Management */}
          <PWAUninstall />
          
          {/* Appearance */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Palette className="mr-3 text-purple-600 dark:text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Appearance</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode" className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use dark theme throughout the app</p>
              </div>
              <Switch 
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </Card>
          
          {/* Notifications */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Bell className="mr-3 text-green-600 dark:text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">Enable Reminders</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get reminders for your habits</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
              
              {settings.notificationsEnabled && (
                <div className="pt-2">
                  <Label htmlFor="reminderTime" className="text-sm font-medium">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={settings.reminderTime}
                    onChange={handleTimeChange}
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </Card>
          
          {/* Data Management */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Download className="mr-3 text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Export Data</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Save a backup of your habits and progress</p>
                <Button 
                  onClick={handleExportData}
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Download size={16} className="mr-2" />
                  Export Data
                </Button>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Import Data</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Restore from a previous backup</p>
                <input
                  type="file"
                  id="importData"
                  accept=".json"
                  onChange={handleImportData}
                  style={{ display: 'none' }}
                />
                <Button 
                  onClick={() => document.getElementById('importData')?.click()}
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Upload size={16} className="mr-2" />
                  Import Data
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <Label className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">This action cannot be undone</p>
                <Button 
                  onClick={handleResetData}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash size={16} className="mr-2" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Privacy & Legal */}
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-3 px-2">
              <Shield className="mr-3 text-orange-600 dark:text-orange-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Privacy & Legal</h3>
            </div>
            
            <div className="space-y-1">
              <SettingsLink 
                to="/permissions"
                icon={<Shield size={18} />}
                title="Permissions"
                description="Manage app permissions and privacy settings"
              />
              
              <SettingsLink 
                to="/privacy-policy"
                icon={<FileText size={18} />}
                title="Privacy Policy"
                description="How we handle your data and privacy"
              />
              
              <SettingsLink 
                to="/terms-of-use"
                icon={<FileText size={18} />}
                title="Terms of Use"
                description="Terms and conditions for using ChainReact"
              />
            </div>
          </Card>
          
          {/* Developer Info */}
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center mb-3 px-2">
              <Info className="mr-3 text-gray-600 dark:text-gray-400" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Developer Info</h3>
            </div>
            
            <div className="space-y-1">
              <SettingsLink 
                to="/opensource-licenses"
                icon={<Code2 size={18} />}
                title="Open Source Credits"
                description="Acknowledgments for libraries and tools used"
              />
              
              <SettingsLink 
                to="/app-info"
                icon={<Info size={18} />}
                title="App Version & Info"
                description="Version number and developer information"
              />
            </div>
          </Card>
          
          {/* About */}
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">About ChainReact</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">A minimalist, gamified habit tracker built to run 100% offline</p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start dark:bg-blue-900/30 dark:border-blue-900 mb-6">
                <AlertCircle size={18} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed text-left">
                  All your data is stored locally on your device. No internet connection is required, and your information is never sent to any server.
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 mb-2">
                  ChainReact v1.0.0
                  <Badge className="bg-blue-500 text-white text-[10px] h-4">Beta</Badge>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Build momentum. One habit at a time.</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
