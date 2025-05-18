
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onFinished();
          }, 500); // Small delay after 100% before dismissing
          return 100;
        }
        return newProgress;
      });
    }, 120); // Adjust timing for desired loading speed
    
    return () => clearInterval(interval);
  }, [onFinished]);
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="relative animate-spin-slow">
        <Clock size={80} className="text-blue-600" strokeWidth={1.5} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
        </div>
      </div>
      
      <div className="mt-8">
        <h1 className="animate-pulse text-4xl font-bold tracking-tight text-blue-800 font-display">
          ChainReact
        </h1>
        <p className="mt-2 text-center text-sm text-blue-600">
          Build momentum. One habit at a time.
        </p>
      </div>
      
      <div className="mt-8 w-64">
        <div className="h-1.5 w-full rounded-full bg-blue-100">
          <div 
            className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-blue-500">
          Loading your habits...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
