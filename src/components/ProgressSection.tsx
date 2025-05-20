
import React from 'react';
import { Trophy } from 'lucide-react';
import { db } from '../db/database';
import { UserStats } from '../types/types';
import { Progress } from '@/components/ui/progress';
import { playXpSound } from '../utils/sounds';

const ProgressSection: React.FC = () => {
  const [stats, setStats] = React.useState<UserStats>(db.getStats());
  const [prevXp, setPrevXp] = React.useState<number>(stats.totalXp);

  React.useEffect(() => {
    // Update stats when they change
    const interval = setInterval(() => {
      const newStats = db.getStats();
      
      // Play sound if XP increased
      if (newStats.totalXp > prevXp) {
        playXpSound();
        setPrevXp(newStats.totalXp);
      }
      
      setStats(newStats);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [prevXp]);

  // Calculate XP progress to the next level
  const xpForCurrentLevel = (stats.level - 1) * 100;
  const xpForNextLevel = stats.level * 100;
  const currentLevelProgress = stats.totalXp - xpForCurrentLevel;
  const progressPercentage = (currentLevelProgress / 100) * 100;
  
  // Get all chains to calculate contribution
  const chains = db.getChains();
  const totalChains = chains.length;
  const contributionPerChain = totalChains > 0 ? 100 / totalChains : 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium text-gray-800 dark:text-gray-200">Your Progress</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">{stats.streakDays} day streak</span>
      </div>
      
      {/* Level progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Level {stats.level}</span>
          <span>{currentLevelProgress}/100 XP to level {stats.level + 1}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Chain contribution info */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Chain Contribution</span>
          <span>{contributionPerChain.toFixed(1)}% per chain</span>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {chains.map((chain, index) => (
            <div 
              key={chain.id}
              className="flex-shrink-0 h-1.5 rounded-full transition-all" 
              style={{ 
                width: `${contributionPerChain}%`, 
                backgroundColor: chain.habits.some(h => h.completed) 
                  ? 'rgb(59, 130, 246)' // blue-500
                  : 'rgb(229, 231, 235)' // gray-200 
              }}
              title={chain.name}
            />
          ))}
          
          {chains.length === 0 && (
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
          )}
        </div>
      </div>
      
      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">Total XP</p>
          <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{stats.totalXp}</p>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <p className="text-xs text-green-700 dark:text-green-300">Completions</p>
          <p className="text-lg font-semibold text-green-900 dark:text-green-100">{stats.totalCompletions}</p>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-300">Longest Streak</p>
          <p className="text-lg font-semibold text-amber-900 dark:text-amber-100">{stats.longestStreak}</p>
        </div>
      </div>
      
      {/* Unlocked badges section */}
      <div className="mt-4">
        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Badges</h3>
        <div className="flex flex-wrap gap-2">
          {stats.badges
            .filter(badge => badge.unlocked)
            .slice(0, 3)
            .map(badge => (
              <div 
                key={badge.id}
                className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-full py-1 px-3 text-xs"
              >
                <Trophy size={12} className="mr-1 text-amber-500" />
                <span className="dark:text-gray-200">{badge.name}</span>
              </div>
            ))}
            
          {stats.badges.filter(badge => badge.unlocked).length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">Complete habits to earn badges!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
