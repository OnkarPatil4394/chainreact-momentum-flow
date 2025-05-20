
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { playStreakSound } from '../utils/sounds';
import confetti from 'canvas-confetti';

interface StreakCelebrationProps {
  streakDays: number;
  onClose: () => void;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({ streakDays, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Play streak sound
    playStreakSound();
    
    // Launch confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Allow time for fade-out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md shadow-xl transform scale-in animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mb-4 mx-auto w-20 h-20 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Trophy size={40} className="text-amber-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {streakDays} Day Streak!
          </h2>
          
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Amazing consistency! Keep up the good work to build lasting habits.
          </p>
          
          <div className="mt-6">
            <button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCelebration;
