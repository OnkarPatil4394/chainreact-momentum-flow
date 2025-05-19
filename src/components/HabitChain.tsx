
import React from 'react';
import { HabitChain as HabitChainType } from '../types/types';
import HabitItem from './HabitItem';
import { db } from '../db/database';

interface HabitChainProps {
  chain: HabitChainType;
  onUpdate: () => void;
}

const HabitChain: React.FC<HabitChainProps> = ({ chain, onUpdate }) => {
  const handleCompleteHabit = (habitId: string) => {
    const success = db.completeHabit(chain.id, habitId);
    if (success) {
      onUpdate();
    }
  };

  // Calculate progress percentage
  const progress = chain.habits.length > 0
    ? (chain.habits.filter(h => h.completed).length / chain.habits.length) * 100
    : 0;

  // Determine if a habit is locked (previous habits must be completed)
  const isHabitLocked = (position: number) => {
    if (position === 0) return false; // First habit is never locked
    
    // Check all previous habits are completed
    for (let i = 0; i < position; i++) {
      if (!chain.habits.find(h => h.position === i)?.completed) {
        return true;
      }
    }
    
    return false;
  };

  // Sort habits by position
  const sortedHabits = [...chain.habits].sort((a, b) => a.position - b.position);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
      {/* Chain header */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{chain.name}</h2>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{chain.streak}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">day streak</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{chain.description}</p>
        
        {/* Progress bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
      
      {/* Habits */}
      <div className="space-y-1">
        {sortedHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            isLocked={isHabitLocked(habit.position)}
            onComplete={handleCompleteHabit}
          />
        ))}
      </div>
    </div>
  );
};

export default HabitChain;
