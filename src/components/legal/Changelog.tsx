
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Changelog = () => {
  const navigate = useNavigate();
  
  // Version history
  const versions = [
    {
      version: "1.0.0",
      date: "May 19, 2025",
      changes: [
        { type: "new", text: "Initial release of ChainReact" },
        { type: "new", text: "Create habit chains with multiple sequential steps" },
        { type: "new", text: "Track daily habit completion with streaks" },
        { type: "new", text: "Earn XP and level up as you complete habits" },
        { type: "new", text: "View statistics on your habit performance" },
        { type: "new", text: "Export and import your data for backup" }
      ]
    },
    {
      version: "0.9.0",
      date: "April 30, 2025",
      changes: [
        { type: "new", text: "Beta release for testing" },
        { type: "fix", text: "Fixed habit chain progression logic" },
        { type: "improvement", text: "Improved UI responsiveness" },
        { type: "fix", text: "Resolved data persistence bugs" }
      ]
    },
    {
      version: "0.5.0",
      date: "March 15, 2025",
      changes: [
        { type: "new", text: "Alpha version with core functionality" },
        { type: "new", text: "Basic habit tracking implemented" },
        { type: "new", text: "Added initial statistics view" }
      ]
    }
  ];

  // Badge component for change types
  const ChangeTypeBadge = ({ type }: { type: string }) => {
    switch (type) {
      case 'new':
        return <Badge className="bg-green-500">New</Badge>;
      case 'fix': 
        return <Badge className="bg-blue-500">Fix</Badge>;
      case 'improvement':
        return <Badge className="bg-purple-500">Improved</Badge>;
      default:
        return <Badge className="bg-gray-500">Update</Badge>;
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
        <h2 className="text-xl font-bold text-gray-800">Changelog</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          A history of updates and improvements to ChainReact.
        </p>
      </div>

      <div className="space-y-6">
        {versions.map((version, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1 bg-blue-500"></div>
            <CardContent className="p-4 pl-5">
              <div className="flex items-center mb-3">
                <div className="mr-auto">
                  <h3 className="font-bold text-gray-800">Version {version.version}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>{version.date}</span>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-2">
                {version.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <ChangeTypeBadge type={change.type} />
                    </div>
                    <span className="text-sm text-gray-700">{change.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
