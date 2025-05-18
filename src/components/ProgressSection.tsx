
import React from 'react';
import { Trophy } from 'lucide-react';
import { db } from '../db/database';
import { UserStats } from '../types/types';

const ProgressSection: React.FC = () => {
  const [stats, setStats] = React.useState<UserStats>(db.getStats());

  React.useEffect(() => {
    // Update stats when they change
    const interval = setInterval(() => {
      setStats(db.getStats());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate XP progress to the next level
  const xpForCurrentLevel = (stats.level - 1) * 100;
  const xpForNextLevel = stats.level * 100;
  const currentLevelProgress = stats.totalXp - xpForCurrentLevel;
  const progressPercentage = (currentLevelProgress / 100) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium text-gray-800">Your Progress</h2>
        <span className="text-sm text-gray-600">{stats.streakDays} day streak</span>
      </div>
      
      {/* Level progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Level {stats.level}</span>
          <span>{currentLevelProgress}/100 XP to level {stats.level + 1}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">Total XP</p>
          <p className="text-lg font-semibold text-blue-900">{stats.totalXp}</p>
        </div>
        <div className="p-2 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700">Completions</p>
          <p className="text-lg font-semibold text-green-900">{stats.totalCompletions}</p>
        </div>
        <div className="p-2 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-700">Longest Streak</p>
          <p className="text-lg font-semibold text-amber-900">{stats.longestStreak}</p>
        </div>
      </div>
      
      {/* Unlocked badges section */}
      <div className="mt-4">
        <h3 className="text-xs font-medium text-gray-700 mb-2">Recent Badges</h3>
        <div className="flex flex-wrap gap-2">
          {stats.badges
            .filter(badge => badge.unlocked)
            .slice(0, 3)
            .map(badge => (
              <div 
                key={badge.id}
                className="flex items-center bg-gray-50 rounded-full py-1 px-3 text-xs"
              >
                <Trophy size={12} className="mr-1 text-amber-500" />
                <span>{badge.name}</span>
              </div>
            ))}
            
          {stats.badges.filter(badge => badge.unlocked).length === 0 && (
            <p className="text-xs text-gray-500 italic">Complete habits to earn badges!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
