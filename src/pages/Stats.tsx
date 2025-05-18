
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { db } from '../db/database';
import { UserStats, HabitChain } from '../types/types';
import { Trophy, Calendar, Star, CheckCheck } from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState<UserStats>(db.getStats());
  const [chains, setChains] = useState<HabitChain[]>([]);
  
  useEffect(() => {
    // Load data
    setStats(db.getStats());
    setChains(db.getChains());
    
    // Set up interval to refresh data
    const interval = setInterval(() => {
      setStats(db.getStats());
      setChains(db.getChains());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate completion rate
  const totalDays = chains.reduce((acc, chain) => {
    const createdDate = new Date(chain.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays;
  }, 0);
  
  const completionRate = totalDays > 0 
    ? Math.round((stats.totalCompletions / totalDays) * 100)
    : 0;
  
  // Get badges by status
  const unlockedBadges = stats.badges.filter(b => b.unlocked);
  const lockedBadges = stats.badges.filter(b => !b.unlocked);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your Statistics</h2>
          <p className="text-sm text-gray-600">
            Track your progress and achievements
          </p>
        </div>
        
        {/* Key stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatsCard
            title="Current Streak"
            value={stats.streakDays}
            description="consecutive days"
            icon={<Calendar size={24} />}
            color="blue"
          />
          <StatsCard
            title="Longest Streak"
            value={stats.longestStreak}
            description="days in a row"
            icon={<Star size={24} />}
            color="amber"
          />
          <StatsCard
            title="Total XP"
            value={stats.totalXp}
            description={`Level ${stats.level}`}
            icon={<Trophy size={24} />}
            color="purple"
          />
          <StatsCard
            title="Completion Rate"
            value={`${completionRate}%`}
            description={`${stats.totalCompletions} total completions`}
            icon={<CheckCheck size={24} />}
            color="green"
          />
        </div>
        
        {/* Badges */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            Badges ({unlockedBadges.length}/{stats.badges.length})
          </h3>
          
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm text-gray-600 mb-2">Unlocked</h4>
              <div className="grid grid-cols-2 gap-3">
                {unlockedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="mr-3 bg-green-100 p-2 rounded-full">
                      <Trophy size={16} className="text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900">{badge.name}</p>
                      <p className="text-xs text-green-700">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {lockedBadges.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-600 mb-2">Locked</h4>
              <div className="grid grid-cols-2 gap-3">
                {lockedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mr-3 bg-gray-100 p-2 rounded-full">
                      <Trophy size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Chains summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            Your Habit Chains ({chains.length})
          </h3>
          
          {chains.length > 0 ? (
            <div className="space-y-3">
              {chains.map(chain => (
                <div key={chain.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{chain.name}</p>
                    <p className="text-xs text-gray-500">{chain.habits.length} habits</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-700">{chain.streak} day streak</p>
                    <p className="text-xs text-gray-500">{chain.totalCompletions} completions</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No habit chains created yet
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Stats;
