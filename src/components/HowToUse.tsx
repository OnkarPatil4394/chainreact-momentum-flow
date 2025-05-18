
import React, { useState } from 'react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowToUse: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-6 w-full"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-medium text-gray-800">How to Use ChainReact</h3>
        </div>
        <CollapsibleTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-4">
            <ol className="list-decimal list-inside space-y-3 text-left">
              <li className="text-sm text-gray-800">
                <span className="font-medium">Create a Habit Chain</span>: Start by creating a new habit chain from the home screen.
              </li>
              <li className="text-sm text-gray-800">
                <span className="font-medium">Add Habits in Sequence</span>: Add habits that you want to complete in order, creating a "chain reaction."
              </li>
              <li className="text-sm text-gray-800">
                <span className="font-medium">Complete in Order</span>: Each day, complete habits in sequence - later habits unlock only when earlier ones are done.
              </li>
              <li className="text-sm text-gray-800">
                <span className="font-medium">Build Momentum</span>: Maintain your streak by completing your chains daily to earn XP and badges.
              </li>
              <li className="text-sm text-gray-800">
                <span className="font-medium">Track Progress</span>: Check your stats to see your streaks, completions, and earned badges.
              </li>
            </ol>
            
            <div className="mt-4 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700 italic">
                Remember: ChainReact uses the concept of habit stacking from "Atomic Habits" - each completed habit makes the next one easier!
              </p>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default HowToUse;
