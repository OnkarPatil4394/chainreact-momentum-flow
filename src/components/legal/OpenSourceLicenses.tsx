
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const OpenSourceLicenses = () => {
  const navigate = useNavigate();
  
  // Library license information
  const libraries = [
    {
      name: "React",
      version: "18.3.1",
      license: "MIT",
      description: "A JavaScript library for building user interfaces",
      licenseText: "MIT License\n\nCopyright (c) Facebook, Inc. and its affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files..."
    },
    {
      name: "Tailwind CSS",
      version: "3.3.0",
      license: "MIT",
      description: "A utility-first CSS framework",
      licenseText: "MIT License\n\nCopyright (c) Tailwind Labs, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files..."
    },
    {
      name: "Lucide React",
      version: "0.462.0",
      license: "ISC",
      description: "Beautiful & consistent icon toolkit",
      licenseText: "ISC License\n\nCopyright (c) 2020, Lucide Contributors\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted..."
    },
    {
      name: "Recharts",
      version: "2.12.7",
      license: "MIT",
      description: "A composable charting library built on React components",
      licenseText: "MIT License\n\nCopyright (c) 2015-present recharts\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files..."
    },
    {
      name: "Radix UI",
      version: "1.0.0",
      license: "MIT",
      description: "Unstyled, accessible components for React",
      licenseText: "MIT License\n\nCopyright (c) 2022 WorkOS\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files..."
    }
  ];

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
        <h2 className="text-xl font-bold text-gray-800">Open Source Licenses</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          ChainReact is built on these amazing open source projects. We're grateful to their creators and contributors.
        </p>
      </div>

      <div className="space-y-3">
        {libraries.map((lib, index) => (
          <Card key={index} className="overflow-hidden">
            <Collapsible>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{lib.name}</h3>
                  <p className="text-xs text-gray-500">v{lib.version} • {lib.license} License</p>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Code2 size={16} />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CardContent className="pt-0 pb-3 px-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">{lib.description}</p>
                  <div className="bg-white p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">{lib.licenseText}</pre>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-6 text-center">
        For full license details, please visit the respective project websites.
      </p>
    </div>
  );
};

export default OpenSourceLicenses;
