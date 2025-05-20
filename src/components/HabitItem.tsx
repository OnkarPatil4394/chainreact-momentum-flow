
import React from 'react';
import { Habit } from '../types/types';
import { Check, ArrowDown } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  isLocked: boolean;
  onComplete: (habitId: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, isLocked, onComplete }) => {
  const handleComplete = () => {
    if (!isLocked && !habit.completed) {
      onComplete(habit.id);
    }
  };

  const getFormattedTime = () => {
    if (!habit.completedAt) return '';
    const date = new Date(habit.completedAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="relative">
      {/* Connection line to next habit */}
      {habit.position < 3 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-8 w-0.5 bg-gray-200 z-0">
          <ArrowDown 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-gray-300" 
            size={16} 
          />
        </div>
      )}
      
      <div 
        className={`
          relative z-10 flex items-center p-4 mb-8 border rounded-lg shadow-sm
          ${habit.completed ? 'bg-green-50 border-green-200' : 
            isLocked ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-gray-200'}
          ${!isLocked && !habit.completed ? 'hover:border-blue-300 cursor-pointer' : ''}
          transition-all duration-200
        `}
        onClick={handleComplete}
      >
        {/* Checkmark or number */}
        <div 
          className={`
            flex items-center justify-center w-8 h-8 mr-3 rounded-full
            ${habit.completed ? 'bg-green-500 text-white' : 
              isLocked ? 'bg-gray-300 text-gray-500' : 'bg-blue-100 text-blue-800'}
          `}
        >
          {habit.completed ? (
            <Check size={16} />
          ) : (
            <span>{habit.position + 1}</span>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className={`text-base font-medium ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>
            {habit.name}
          </h3>
          <p className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
            {habit.description}
          </p>
        </div>
        
        {/* Completion indicator */}
        {habit.completed && (
          <div className="text-xs text-green-700">
            <span>Completed</span>
            <span className="block">{getFormattedTime()}</span>
          </div>
        )}
        
        {/* Lock indicator */}
        {isLocked && !habit.completed && (
          <div className="text-xs text-gray-500">
            <span>Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitItem;
