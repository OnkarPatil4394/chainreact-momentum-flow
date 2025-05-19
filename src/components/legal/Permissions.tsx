
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HardDriveDownload, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { db } from '@/db/database';
import { toast } from '@/hooks/use-toast';

const Permissions = () => {
  const navigate = useNavigate();
  const [storageEnabled, setStorageEnabled] = useState(true);

  const handleStorageToggle = (enabled: boolean) => {
    setStorageEnabled(enabled);
    
    if (enabled) {
      toast({
        title: "Storage access enabled",
        description: "You can now export and import your habit data",
      });
    } else {
      toast({
        title: "Storage access disabled",
        description: "Export and import features will be limited",
        variant: "destructive",
      });
    }
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
        <h2 className="text-xl font-bold text-gray-800">App Permissions</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-start p-2 mb-4">
            <Shield className="h-8 w-8 text-blue-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Why Permissions Matter</h3>
              <p className="text-sm text-gray-600">
                ChainReact is designed to respect your privacy. We only request permissions that are essential for the app's core functionality.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <HardDriveDownload className="h-5 w-5 text-gray-700 mr-2" />
                <span className="font-medium text-gray-800">Storage Access</span>
              </div>
              <Switch 
                checked={storageEnabled}
                onCheckedChange={handleStorageToggle}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              Allows ChainReact to create and access backup files on your device. 
              This permission is required for exporting and importing your habit data.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-800">
              <p className="mb-2">
                <strong>How this permission is used:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Create JSON backup files when you export your data</li>
                <li>Read backup files when you choose to import data</li>
                <li>All files remain on your device and are never transmitted elsewhere</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-xs text-gray-500 px-1">
        You can modify permissions at any time through this settings page or through your device's system settings.
      </p>
    </div>
  );
};

export default Permissions;
