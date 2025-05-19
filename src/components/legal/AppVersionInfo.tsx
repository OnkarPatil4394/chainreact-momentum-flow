
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info, Mail, Github, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppVersionInfo = () => {
  const navigate = useNavigate();
  
  // App version information
  const appInfo = {
    name: "ChainReact",
    version: "1.0.0",
    buildDate: "May 19, 2025",
    buildNumber: "10025",
    developer: "Vaion",
    contact: "vaiondevelopers@gmail.com",
    website: "https://chainreact.app",
    github: "https://github.com/vaion/chainreact",
    copyright: "© 2025 Vaion. All rights reserved."
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          className="mr-2"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-gray-800">App Information</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-white">CR</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{appInfo.name}</h1>
            <p className="text-sm text-gray-600">Build momentum. One habit at a time.</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Version Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Version</span>
                  <span className="text-xs font-medium text-gray-700">{appInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Build date</span>
                  <span className="text-xs font-medium text-gray-700">{appInfo.buildDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Build number</span>
                  <span className="text-xs font-medium text-gray-700">{appInfo.buildNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Developer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Developer</span>
                  <span className="text-xs font-medium text-gray-700">{appInfo.developer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Contact</span>
                  <a href={`mailto:${appInfo.contact}`} className="text-xs font-medium text-blue-600 flex items-center">
                    <Mail size={12} className="mr-1" />
                    {appInfo.contact}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Website</span>
                  <a href={appInfo.website} className="text-xs font-medium text-blue-600 flex items-center">
                    <Globe size={12} className="mr-1" />
                    chainreact.app
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">GitHub</span>
                  <a href={appInfo.github} className="text-xs font-medium text-blue-600 flex items-center">
                    <Github size={12} className="mr-1" />
                    vaion/chainreact
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-3 border-t border-gray-100 flex justify-center">
            <div className="flex items-center text-xs text-gray-500">
              <Info size={12} className="mr-1" />
              <span>{appInfo.copyright}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppVersionInfo;
