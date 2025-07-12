
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { db } from '@/db/database';

interface LanguageSelectionScreenProps {
  onComplete: (languageCode: string) => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleConfirm = () => {
    // Save language preference to database
    const currentSettings = db.getSettings();
    db.updateSettings({
      ...currentSettings,
      language: selectedLanguage
    });
    onComplete(selectedLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="relative mb-4 animate-pulse">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mx-auto">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-blue-800 dark:text-blue-200 font-display">
            Choose Your Language
          </h1>
          <p className="text-center text-sm text-blue-600 dark:text-blue-400">
            Select your preferred language to get started
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 dark:text-gray-100">
              Available Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
              showSearch={true}
              compact={false}
            />
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleConfirm}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
