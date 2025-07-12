
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '../db/database';
import { sanitizeInput, validateInput } from '../utils/security';
import LanguageSelectionScreen from './LanguageSelectionScreen';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'language' | 'name'>('language');
  const [userName, setUserName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [error, setError] = useState('');
  
  const handleLanguageComplete = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('name');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const sanitizedName = sanitizeInput(userName);
      
      if (!sanitizedName.trim()) {
        setError('Name is required');
        return;
      }
      
      if (!validateInput(sanitizedName, 50)) {
        setError('Name contains invalid characters or is too long');
        return;
      }
      
      // Save the user name to the database
      db.saveUserName(sanitizedName);
      
      // Save language preference
      const currentSettings = db.getSettings();
      db.updateSettings({
        ...currentSettings,
        language: selectedLanguage
      });
      
      // Complete the welcome process
      onComplete();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid name');
    }
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setUserName(sanitizedValue);
    if (error) setError(''); // Clear error on change
  };

  if (step === 'language') {
    return <LanguageSelectionScreen onComplete={handleLanguageComplete} />;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="relative mb-6 animate-spin-slow">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <div className="h-16 w-16 rounded-full bg-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        </div>
      </div>
      
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-blue-800 font-display">
        Welcome to ChainReact
      </h1>
      <p className="mb-6 text-center text-sm text-blue-600">
        Build momentum. One habit at a time.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <div>
          <label htmlFor="userName" className="mb-2 block text-sm font-medium text-gray-700">
            What should we call you?
          </label>
          <Input
            id="userName"
            value={userName}
            onChange={handleNameChange}
            placeholder="Your name"
            className="bg-white"
            maxLength={50}
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!userName.trim()}
        >
          Get Started
        </Button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
