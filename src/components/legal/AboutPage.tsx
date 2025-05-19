
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const appVersion = "1.0.0";
  const buildDate = "May 19, 2025";
  const developerName = "Vaion";
  const contactEmail = "vaiondevelopers@gmail.com";

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
        <h2 className="text-xl font-bold text-gray-800">About ChainReact</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5 flex flex-col items-center">
          <h1 className="text-xl font-bold text-blue-600 mb-1">ChainReact</h1>
          <p className="text-sm text-gray-600 mb-4">Build momentum. One habit at a time.</p>
          
          <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 text-xs mb-6">
            Version {appVersion} • Built on {buildDate}
          </div>
          
          <div className="border-t border-gray-100 w-full pt-4 mt-1 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              ChainReact was created to help people build and maintain positive habits through the 
              concept of "habit stacking" - where each completed action creates momentum for the next one 
              in your daily routine.
            </p>
            
            <p className="text-sm text-gray-700 mb-4">
              The app runs 100% offline, with all your data stored locally on your device. 
              Your privacy is important to us, which is why ChainReact never connects to 
              external servers or shares your information with third parties.
            </p>
            
            <div className="flex justify-center">
              <div className="inline-flex items-center text-blue-600 text-sm">
                <Heart size={16} className="mr-1" /> 
                <span>Created by {developerName}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2 border-t border-gray-100 w-full">
            <p className="text-xs text-gray-500 mb-2">Questions or feedback?</p>
            <a href={`mailto:${contactEmail}`} className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm">
              <Mail size={14} className="mr-1" />
              {contactEmail}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
