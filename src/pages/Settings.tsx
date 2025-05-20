
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Add Badge import
import { db } from '../db/database';
import { AppSettings } from '../types/types';
import { toast } from '@/hooks/use-toast';
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
  HelpCircle,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  
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
    
    // Apply dark mode change to the document
    if (updatedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
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
          // Refresh settings after import
          setSettings(db.getSettings());
          
          // Apply dark mode if needed after import
          const updatedSettings = db.getSettings();
          if (updatedSettings.darkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
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
    // Reset file input
    e.target.value = '';
  };
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      // Clear all localStorage data
      localStorage.clear();
      
      // Reset to default settings
      setSettings(db.getSettings());
      
      toast({
        title: 'Data reset complete',
        description: 'All habits and progress have been cleared',
        duration: 3000,
      });
    }
  };
  
  // Link component for settings items
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
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">Settings</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customize ChainReact to your preferences</p>
        </div>
        
        {/* Display options */}
        <Card className="mb-6 p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">Display Options</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode" className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Use dark theme throughout the app</p>
              </div>
              <Switch 
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={handleToggleDarkMode}
              />
            </div>
          </div>
        </Card>
        
        {/* Notifications */}
        <Card className="mb-6 p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">Enable Reminders</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get reminders for your habits</p>
              </div>
              <Switch 
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
              />
            </div>
            
            {settings.notificationsEnabled && (
              <div>
                <Label htmlFor="reminderTime" className="text-sm font-medium">Reminder Time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={settings.reminderTime}
                  onChange={handleTimeChange}
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </Card>
        
        {/* Data Management */}
        <Card className="mb-6 p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">Data Management</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="exportData" className="text-sm font-medium">Export Data</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Save a backup of your habits and progress</p>
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="flex items-center dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Download size={16} className="mr-2" />
                Export Data
              </Button>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="importData" className="text-sm font-medium">Import Data</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Restore from a previous backup</p>
              <div className="flex items-center">
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
                  className="flex items-center dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Upload size={16} className="mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex flex-col space-y-2">
                <Label className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</Label>
                <Button 
                  onClick={handleResetData}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  <Trash size={16} className="mr-2" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Permissions */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <SettingsLink 
            to="/permissions"
            icon={<Shield size={20} />}
            title="Permissions"
            description="Manage app permissions and privacy settings"
          />
        </Card>
        
        {/* Legal & Info */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 px-4 pt-4 pb-2">Legal & Info</h3>
          
          <div className="border-t border-gray-100 dark:border-gray-700">
            <SettingsLink 
              to="/privacy-policy"
              icon={<FileText size={20} />}
              title="Privacy Policy"
              description="How we handle your data and privacy"
            />
            
            <SettingsLink 
              to="/terms-of-use"
              icon={<FileText size={20} />}
              title="Terms of Use"
              description="Terms and conditions for using ChainReact"
            />
            
            <SettingsLink 
              to="/opensource-licenses"
              icon={<Code2 size={20} />}
              title="Open Source Credits"
              description="Acknowledgments for libraries and tools used"
            />
            
            <SettingsLink 
              to="/app-info"
              icon={<Info size={20} />}
              title="App Version & Info"
              description="Version number and developer information"
            />
          </div>
        </Card>
        
        {/* About */}
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">About ChainReact</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">A minimalist, gamified habit tracker built to run 100% offline</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start dark:bg-blue-900/30 dark:border-blue-900">
            <AlertCircle size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              All your data is stored locally on your device. No internet connection is required, and your information is never sent to any server.
            </p>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              ChainReact v1.0.0
              <Badge className="bg-blue-500 text-white text-[10px] h-4">Beta</Badge>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Build momentum. One habit at a time.</p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
