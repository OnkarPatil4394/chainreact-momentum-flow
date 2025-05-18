
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon,
  color = "blue" 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-50 border-green-100 text-green-800';
      case 'amber':
        return 'bg-amber-50 border-amber-100 text-amber-800';
      case 'purple':
        return 'bg-purple-50 border-purple-100 text-purple-800';
      case 'blue':
      default:
        return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };
  
  return (
    <div className={`rounded-lg border p-4 ${getColorClasses()}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs mt-1 opacity-80">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="opacity-70">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
