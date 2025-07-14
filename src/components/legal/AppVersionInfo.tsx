import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Trophy, FileText, Linkedin, Github, Hash, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppVersionInfo = () => {
  const navigate = useNavigate();
  
  const appVersion = "1.0.0";
  const buildNumber = "1001";

  const contactLinks = [
    {
      title: "Product Hunt",
      url: "https://www.producthunt.com/@vaion_developers",
      icon: <Trophy size={18} />,
      description: "Follow us on Product Hunt"
    },
    {
      title: "Dev.to",
      url: "https://dev.to/vaiondevelopers",
      icon: <FileText size={18} />,
      description: "Read our development blog"
    },
    {
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/vaiondevelopers",
      icon: <Linkedin size={18} />,
      description: "Connect with us professionally"
    },
    {
      title: "Indie Hackers",
      url: "https://www.indiehackers.com/vaiondevelopers/",
      icon: <Hash size={18} />,
      description: "Follow our indie journey"
    },
    {
      title: "GitHub",
      url: "https://github.com/vaiondevelopers",
      icon: <Github size={18} />,
      description: "Check out our open source projects"
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">App Info</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <h1 className="text-2xl font-bold mb-1">ChainReact</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 dark:text-gray-400">Version {appVersion}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Build {buildNumber}</p>
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
                Vaion Developers
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                vaiondevelopers@gmail.com
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Development Blog</h3>
              <button
                onClick={() => navigate('/devblog')}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">ChainReact DevBlog</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Read about our development journey</p>
                  </div>
                </div>
                <ArrowLeft size={16} className="text-gray-400 dark:text-gray-500 rotate-180" />
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Contact Us</h3>
              <div className="space-y-2">
                {contactLinks.map((link) => (
                  <button
                    key={link.title}
                    onClick={() => handleLinkClick(link.url)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex items-center justify-center text-gray-600 dark:text-gray-400 mr-3">
                        {link.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">{link.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{link.description}</p>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 dark:text-gray-500" />
                  </button>
                ))}
              </div>
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
