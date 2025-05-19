
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  useEffect(() => {
    // Update active tab based on current path
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('home');
    } else if (path === '/stats') {
      setActiveTab('stats');
    } else if (path === '/settings') {
      setActiveTab('settings');
    }
  }, [location]);
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* App Name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">ChainReact</h1>
            <Badge className="bg-blue-500 text-white text-[10px] h-5">Beta</Badge>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center px-4 py-2 h-auto"
            >
              <Home size={18} />
              <span className="text-xs mt-1">Home</span>
            </Button>
          </Link>
          
          <Link to="/stats">
            <Button
              variant={activeTab === 'stats' ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center px-4 py-2 h-auto"
            >
              <BarChart2 size={18} />
              <span className="text-xs mt-1">Stats</span>
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              size="sm"
              className="flex flex-col items-center px-4 py-2 h-auto"
            >
              <Settings size={18} />
              <span className="text-xs mt-1">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
