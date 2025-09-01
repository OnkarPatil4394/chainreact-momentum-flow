
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart2, Settings } from 'lucide-react';

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
    <header className="app-header bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
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
