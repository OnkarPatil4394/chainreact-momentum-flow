
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const AppVersionInfo = () => {
  const navigate = useNavigate();
  
  const appVersion = "1.0.0";
  const buildNumber = "1001";
  const buildDate = "May 19, 2025";

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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">App Info</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-2xl font-bold mb-1">ChainReact</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 dark:text-gray-400">Version {appVersion}</span>
              <Badge className="bg-blue-500 text-white">Beta</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Build {buildNumber} ({buildDate})</p>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ChainReact is a minimalist, gamified habit tracker designed to help you build and maintain powerful habit chains.
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Developer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ChainReact Team
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Website</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                chainreact.app
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                support@chainreact.app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Made with ❤️ for habit builders everywhere
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Copyright © 2025 ChainReact Team
        </p>
      </div>
    </div>
  );
};

export default AppVersionInfo;
