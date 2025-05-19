
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

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
        <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 text-sm text-gray-700">
          <p className="text-xs text-gray-500 mb-4">Last updated: {currentDate}</p>
          
          <h3 className="font-medium text-gray-800 mb-2">Introduction</h3>
          <p className="mb-4">
            This Privacy Policy explains how ChainReact ("we", "us", or "our") handles your data when you use our mobile application. 
            ChainReact is designed to operate offline and store all data locally on your device.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Information Collection</h3>
          <p className="mb-4">
            <strong>Local Storage Only:</strong> All your data in ChainReact is stored locally on your device. 
            This includes habit chains, progress tracking, settings, and any other information created through your use of the app.
            We do not collect, store, or transmit your personal data to any external servers or third parties.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Data Export/Import</h3>
          <p className="mb-4">
            ChainReact allows you to export your data as JSON files for backup purposes and import them later. 
            These files are stored on your device's storage and are not transmitted to us. You have full control over these exported files.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Permissions</h3>
          <p className="mb-4">
            <strong>Storage Access:</strong> We request storage access permission solely to enable the data export/import functionality, 
            allowing you to back up your habit tracking data.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Your Data Rights</h3>
          <p className="mb-4">
            Since all data is stored locally on your device, you have complete control over your information. You can:
            <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
              <li>View all your data within the app</li>
              <li>Export data as backup files</li>
              <li>Delete your data using the "Reset All Data" function in Settings</li>
              <li>Uninstall the app, which will remove all associated data (unless you've created external backups)</li>
            </ul>
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Children's Privacy</h3>
          <p className="mb-4">
            ChainReact does not knowingly collect any personally identifiable information from children under 13. 
            Since the app stores all data locally on the device, parents can monitor their child's usage directly through device access.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Changes to This Policy</h3>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Contact Us</h3>
          <p className="mb-2">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">vaiondevelopers@gmail.com</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
