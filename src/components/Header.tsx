
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, BarChart2, Settings } from 'lucide-react';
import { db } from '../db/database';
import { UserStats } from '../types/types';

const Header = () => {
  const location = useLocation();
  const [stats, setStats] = React.useState<UserStats>(db.getStats());

  // Determine which link is active
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-600';
  };

  React.useEffect(() => {
    // Listen for changes in stats
    const interval = setInterval(() => {
      setStats(db.getStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">ChainReact</h1>
            <div className="ml-3 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
              <span>Lvl {stats.level}</span>
              <span className="mx-1">•</span>
              <span>{stats.totalXp} XP</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/" className={`${isActive('/')} flex flex-col items-center text-xs`}>
              <Trophy size={18} />
              <span>Habits</span>
            </Link>
            <Link to="/stats" className={`${isActive('/stats')} flex flex-col items-center text-xs`}>
              <BarChart2 size={18} />
              <span>Stats</span>
            </Link>
            <Link to="/settings" className={`${isActive('/settings')} flex flex-col items-center text-xs`}>
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
