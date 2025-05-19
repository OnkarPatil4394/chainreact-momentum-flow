
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash } from 'lucide-react';
import { HabitChain, Habit } from '../types/types';
import { db, generateId } from '../db/database';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ open, onClose }) => {
  const [chainName, setChainName] = useState('');
  const [chainDescription, setChainDescription] = useState('');
  const [habits, setHabits] = useState<Omit<Habit, 'chainId' | 'completed' | 'completedAt'>[]>([
    { id: generateId(), name: '', description: '', position: 0 }
  ]);

  const handleAddHabit = () => {
    setHabits([
      ...habits,
      {
        id: generateId(),
        name: '',
        description: '',
        position: habits.length,
      }
    ]);
  };

  const handleRemoveHabit = (id: string) => {
    if (habits.length <= 1) return;
    
    const updatedHabits = habits.filter(h => h.id !== id);
    // Update positions
    const reindexedHabits = updatedHabits.map((h, index) => ({
      ...h,
      position: index
    }));
    
    setHabits(reindexedHabits);
  };

  const handleHabitChange = (id: string, field: 'name' | 'description', value: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!chainName.trim()) return;
    if (habits.some(h => !h.name.trim())) return;
    
    const newChainId = generateId();
    const newChain: HabitChain = {
      id: newChainId,
      name: chainName,
      description: chainDescription,
      habits: habits.map(h => ({
        ...h,
        chainId: newChainId,
        completed: false,
        completedAt: null
      })),
      createdAt: new Date().toISOString(),
      lastCompleted: null,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0
    };
    
    db.addChain(newChain);
    
    // Reset form and close modal
    setChainName('');
    setChainDescription('');
    setHabits([{ id: generateId(), name: '', description: '', position: 0 }]);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20" onClick={onClose}></div>
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Create Habit Chain</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Chain details */}
                <div className="space-y-2">
                  <label htmlFor="chainName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chain Name
                  </label>
                  <Input 
                    id="chainName"
                    value={chainName}
                    onChange={e => setChainName(e.target.value)}
                    placeholder="Morning Routine"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="chainDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="chainDescription"
                    value={chainDescription}
                    onChange={e => setChainDescription(e.target.value)}
                    placeholder="My daily morning routine for productivity"
                    className="w-full"
                    rows={2}
                  />
                </div>
                
                {/* Habits */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Habits</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Will unlock in sequence</span>
                  </div>
                  
                  {habits.map((habit, index) => (
                    <div key={habit.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                          {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHabit(habit.id)}
                          disabled={habits.length <= 1}
                          className={`text-red-500 ${habits.length <= 1 ? 'opacity-30' : 'hover:text-red-700 dark:hover:text-red-400'}`}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      
                      <Input 
                        value={habit.name}
                        onChange={e => handleHabitChange(habit.id, 'name', e.target.value)}
                        placeholder="Habit name"
                        required
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                      
                      <Input
                        value={habit.description}
                        onChange={e => handleHabitChange(habit.id, 'description', e.target.value)}
                        placeholder="Short description (optional)"
                        className="dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  ))}
                  
                  <Button 
                    type="button"
                    onClick={handleAddHabit}
                    variant="outline"
                    className="w-full flex items-center justify-center text-blue-600 dark:text-blue-400 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Habit
                  </Button>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex space-x-3 p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Chain
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateHabitModal;
