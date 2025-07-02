
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Upload, Trash2, Moon, Sun, Volume2, VolumeX, ExternalLink, Shield, FileText, Info, BookOpen, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/db/database';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState(db.getSettings());

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    applyTheme(settings.theme, settings.darkMode);
  }, [settings.theme, settings.darkMode]);

  const applyTheme = (theme: string, darkMode: boolean) => {
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
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    db.updateSettings(newSettings);
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value, settings.darkMode);
    } else if (key === 'darkMode') {
      applyTheme(settings.theme, value);
    }
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
      duration: 2000,
    });
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
        title: "Data exported",
        description: "Your ChainReact data has been exported successfully.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const success = db.importData(data);
        
        if (success) {
          toast({
            title: "Data imported",
            description: "Your ChainReact data has been imported successfully.",
            duration: 3000,
          });
          
          // Refresh the page to show imported data
          window.location.reload();
        } else {
          throw new Error('Import failed');
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      db.clearAllData();
      toast({
        title: "Data cleared",
        description: "All your ChainReact data has been cleared.",
        duration: 3000,
      });
      
      // Refresh the page
      window.location.reload();
    }
  };

  const themeOptions = [
    { value: 'default', label: 'No Color', description: 'Clean minimal design' },
    { value: 'sage', label: 'Sage Green', description: 'Calming nature-inspired' },
    { value: 'lavender', label: 'Soft Lavender', description: 'Gentle and relaxing' },
    { value: 'peach', label: 'Warm Peach', description: 'Soft and welcoming' },
    { value: 'ocean', label: 'Ocean Blue', description: 'Peaceful and serene' },
    { value: 'rose', label: 'Dusty Rose', description: 'Elegant and subtle' }
  ];

  const legalPages = [
    {
      title: "Privacy Policy",
      path: "/privacy-policy",
      icon: <Shield size={18} />,
      description: "How we protect your data"
    },
    {
      title: "Terms of Use",
      path: "/terms-of-use",
      icon: <FileText size={18} />,
      description: "Terms and conditions"
    },
    {
      title: "App Information",
      path: "/app-info",
      icon: <Info size={18} />,
      description: "Version and developer info"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
              <Palette size={18} className="mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="dark-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dark Mode
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between light and dark themes
                </span>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>
            
            <Separator className="dark:bg-gray-700" />
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Palette size={16} className="mr-2" />
                  Theme Color
                </Label>
              </div>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => handleSettingChange('theme', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {themeOptions.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{theme.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Calming colors with subtle patterns that work in both light and dark modes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
              {settings.soundEnabled ? <Volume2 size={18} className="mr-2" /> : <VolumeX size={18} className="mr-2" />}
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Label htmlFor="sound-enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sound Effects
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Play sounds for habit completions
                </span>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
              />
            </div>
            
            <Separator className="dark:bg-gray-700" />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Volume
              </Label>
              <Select 
                value={settings.soundVolume.toString()} 
                onValueChange={(value) => handleSettingChange('soundVolume', parseFloat(value))}
                disabled={!settings.soundEnabled}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  <SelectItem value="0.3">Low</SelectItem>
                  <SelectItem value="0.5">Medium</SelectItem>
                  <SelectItem value="0.8">High</SelectItem>
                  <SelectItem value="1.0">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="flex items-center justify-center dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download size={16} className="mr-2" />
                Export Data
              </Button>
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button 
                  onClick={() => document.getElementById('import-file')?.click()}
                  variant="outline"
                  className="flex items-center justify-center w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload size={16} className="mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
            
            <Separator className="dark:bg-gray-700" />
            
            <Button 
              onClick={handleClearAllData}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Trash2 size={16} className="mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* Legal & Information */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">Legal & Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {legalPages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
                      {page.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{page.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{page.description}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400 dark:text-gray-500" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">ChainReact</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Build momentum. One habit at a time.
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">v1.0.0</Badge>
              <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-400">Beta</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Made with ❤️ by Vaion Developers
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
