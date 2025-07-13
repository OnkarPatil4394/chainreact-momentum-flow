import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import { db } from '../db/database';
import { UserStats, HabitChain } from '../types/types';
import { Trophy, Calendar, Star, CheckCheck, Trash2 } from 'lucide-react';
import { playSettingsSound } from '../utils/sounds'; // Import the sound utility
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Stats = () => {
  const [stats, setStats] = useState<UserStats>(db.getStats());
  const [chains, setChains] = useState<HabitChain[]>([]);
  const [chainToDelete, setChainToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
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
  
  const handleDeleteChain = (chainId: string) => {
    db.deleteChain(chainId);
    setChains(db.getChains());
    setStats(db.getStats());
    
    // Play settings sound on delete
    playSettingsSound();
    
    toast({
      title: "Chain deleted",
      description: "The habit chain has been successfully deleted",
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">Your Statistics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">
            Badges ({unlockedBadges.length}/{stats.badges.length})
          </h3>
          
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Unlocked</h4>
              <div className="grid grid-cols-2 gap-3">
                {unlockedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-900/50">
                    <div className="mr-3 bg-green-100 dark:bg-green-800 p-2 rounded-full">
                      <Trophy size={16} className="text-green-700 dark:text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">{badge.name}</p>
                      <p className="text-xs text-green-700 dark:text-green-300">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {lockedBadges.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Locked</h4>
              <div className="grid grid-cols-2 gap-3">
                {lockedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="mr-3 bg-gray-100 dark:bg-gray-600 p-2 rounded-full">
                      <Trophy size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Chains summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto max-h-[400px]">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">
            Your Habit Chains ({chains.length})
          </h3>
          
          {chains.length > 0 ? (
            <div className="space-y-3">
              {chains.map(chain => (
                <div key={chain.id} className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/80">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{chain.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{chain.habits.length} habits</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mr-3">{chain.streak} day streak</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setChainToDelete(chain.id)}
                          className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Habit Chain</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{chain.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteChain(chain.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No habit chains created yet
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Stats;
