
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash } from 'lucide-react';
import { HabitChain, Habit } from '../types/types';
import { db, generateId } from '../db/database';

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
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Create Habit Chain</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Chain details */}
            <div className="space-y-2">
              <label htmlFor="chainName" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="chainDescription" className="text-sm font-medium text-gray-700">
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
                <h3 className="text-sm font-medium text-gray-700">Habits</h3>
                <span className="text-xs text-gray-500">Will unlock in sequence</span>
              </div>
              
              {habits.map((habit, index) => (
                <div key={habit.id} className="p-3 border border-gray-200 rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHabit(habit.id)}
                      disabled={habits.length <= 1}
                      className={`text-red-500 ${habits.length <= 1 ? 'opacity-30' : 'hover:text-red-700'}`}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <Input 
                    value={habit.name}
                    onChange={e => handleHabitChange(habit.id, 'name', e.target.value)}
                    placeholder="Habit name"
                    required
                  />
                  
                  <Input
                    value={habit.description}
                    onChange={e => handleHabitChange(habit.id, 'description', e.target.value)}
                    placeholder="Short description (optional)"
                  />
                </div>
              ))}
              
              <Button 
                type="button"
                onClick={handleAddHabit}
                variant="outline"
                className="w-full flex items-center justify-center text-blue-600 border-dashed border-blue-200 hover:border-blue-400"
              >
                <Plus size={16} className="mr-1" />
                Add Habit
              </Button>
            </div>
            
            <div className="flex space-x-3 pt-2">
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
