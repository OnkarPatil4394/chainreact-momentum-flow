
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfUse = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Terms of Use</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 text-sm text-gray-700">
          <p className="text-xs text-gray-500 mb-4">Last updated: {currentDate}</p>
          
          <h3 className="font-medium text-gray-800 mb-2">Agreement to Terms</h3>
          <p className="mb-4">
            By using ChainReact, you agree to these Terms of Use. If you do not agree with these terms, please do not use the application.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Description of Service</h3>
          <p className="mb-4">
            ChainReact is a habit tracking application designed to help users build and maintain positive habits through sequential habit chains. 
            The app operates entirely offline and stores all data locally on your device.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">User Responsibilities</h3>
          <p className="mb-4">
            As a user of ChainReact, you are responsible for:
            <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
              <li>Maintaining the security of your device and your exported data backups</li>
              <li>Using the app in compliance with all applicable laws and regulations</li>
              <li>Creating regular backups of your data using the export functionality if desired</li>
            </ul>
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">App Limitations</h3>
          <p className="mb-4">
            ChainReact is provided "as is" and "as available" without any warranties, either express or implied. We do not guarantee that:
            <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
              <li>The app will always function without interruptions, delays, or imperfections</li>
              <li>Data will never be lost (we recommend using the export feature for important data)</li>
              <li>All features will be available at all times or on all devices</li>
            </ul>
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Disclaimers</h3>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, 
            INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="mb-4">
            ChainReact is a habit tracking tool and is not intended to provide medical, psychological, or professional advice. 
            The app is not a substitute for professional guidance related to health, mental well-being, or personal development.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Limitation of Liability</h3>
          <p className="mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
            OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APP.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Changes to These Terms</h3>
          <p className="mb-4">
            We may update our Terms of Use from time to time. We will notify you of any changes by posting the new Terms on this page 
            and updating the "Last updated" date.
          </p>
          
          <h3 className="font-medium text-gray-800 mb-2">Contact Us</h3>
          <p className="mb-2">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-4">vaiondevelopers@gmail.com</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfUse;
