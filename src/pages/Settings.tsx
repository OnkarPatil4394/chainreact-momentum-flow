import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Upload, Trash2, ExternalLink, Shield, FileText, Info, Trophy, Github, Linkedin, Hash, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { db } from '@/db/database';
import SEO from '@/components/SEO';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [settings, setSettings] = useState(db.getSettings());

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    db.updateSettings(newSettings);
    
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

  const contactLinks = [
    {
      title: "Product Hunt",
      url: "https://www.producthunt.com/@vaion_developers",
      icon: <Trophy size={18} />,
      description: "Follow us on Product Hunt"
    },
    {
      title: "Dev.to",
      url: "https://dev.to/vaiondevelopers",
      icon: <BookOpen size={18} />,
      description: "Read our development blog"
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/vaiondevelopers",
      icon: <Linkedin size={18} />,
      description: "Connect with us professionally"
    },
    {
      title: "Indie Hackers",
      url: "https://www.indiehackers.com/vaiondevelopers/",
      icon: <Hash size={18} />,
      description: "Follow our indie journey"
    },
    {
      title: "GitHub",
      url: "https://github.com/vaiondevelopers",
      icon: <Github size={18} />,
      description: "Check out our open source projects"
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const settingsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Settings - ChainReact Habit Tracker",
    "description": "Customize your ChainReact experience with themes, notifications, and app preferences. Personalize your habit tracking journey.",
    "isPartOf": {
      "@type": "WebApplication",
      "name": "ChainReact"
    }
  };

  return (
    <>
      <SEO 
        title="Settings & Preferences - ChainReact"
        description="Customize your ChainReact experience with themes, dark mode, notifications, and app preferences. Personalize your habit tracking journey for maximum productivity."
        keywords="app settings, habit tracker preferences, dark mode, themes, notifications, customization, personalization"
        structuredData={settingsStructuredData}
      />
      <div className="app-container bg-gray-50 dark:bg-gray-900">
        <div className="app-main container mx-auto px-4 py-4 custom-scrollbar">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Settings & Preferences</h1>
          </div>

          <div className="space-y-6">
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

            {/* Developer Info */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-100">Developer Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contactLinks.map((link) => (
                    <button
                      key={link.title}
                      onClick={() => handleLinkClick(link.url)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
                          {link.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{link.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{link.description}</p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 dark:text-gray-500" />
                    </button>
                  ))}
                </div>
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
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Made with ❤️ by Vaion Developers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
