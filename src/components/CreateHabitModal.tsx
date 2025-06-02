import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash, Trash2 } from 'lucide-react';
import { HabitChain, Habit } from '../types/types';
import { db, generateId } from '../db/database';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { sanitizeInput, validateInput } from '../utils/security';

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
  editingChain?: HabitChain;
}

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ open, onClose, editingChain }) => {
  const [chainName, setChainName] = useState(editingChain?.name || '');
  const [chainDescription, setChainDescription] = useState(editingChain?.description || '');
  const [habits, setHabits] = useState<Omit<Habit, 'chainId' | 'completed' | 'completedAt'>[]>(
    editingChain?.habits.map(h => ({ 
      id: h.id,
      name: h.name,
      description: h.description,
      position: h.position
    })) || 
    [{ id: generateId(), name: '', description: '', position: 0 }]
  );

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
    // Sanitize input on change
    const sanitizedValue = sanitizeInput(value);
    setHabits(habits.map(h => 
      h.id === id ? { ...h, [field]: sanitizedValue } : h
    ));
  };

  const handleDeleteChain = () => {
    if (editingChain && confirm('Are you sure you want to delete this habit chain?')) {
      try {
        db.deleteChain(editingChain.id);
        toast({
          title: "Habit chain deleted",
          description: "Your habit chain has been removed",
          duration: 3000,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete habit chain",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Sanitize inputs
      const sanitizedChainName = sanitizeInput(chainName);
      const sanitizedChainDescription = sanitizeInput(chainDescription);
      
      // Basic validation
      if (!sanitizedChainName.trim()) {
        toast({
          title: "Error",
          description: "Chain name is required",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      if (!validateInput(sanitizedChainName, 100)) {
        toast({
          title: "Error",
          description: "Chain name is invalid or too long",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      if (habits.some(h => !sanitizeInput(h.name).trim())) {
        toast({
          title: "Error",
          description: "All habits must have names",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      // Validate habit names
      for (const habit of habits) {
        if (!validateInput(habit.name, 100)) {
          toast({
            title: "Error",
            description: "One or more habit names are invalid",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
      }
      
      if (editingChain) {
        // Update existing chain
        const updatedChain: HabitChain = {
          ...editingChain,
          name: sanitizedChainName,
          description: sanitizedChainDescription,
          habits: habits.map(h => ({
            ...h,
            name: sanitizeInput(h.name),
            description: sanitizeInput(h.description),
            chainId: editingChain.id,
            completed: false,
            completedAt: null
          }))
        };
        
        db.updateChain(updatedChain);
        toast({
          title: "Habit chain updated",
          description: "Your changes have been saved",
          duration: 3000,
        });
      } else {
        // Create new chain
        const newChainId = generateId();
        const newChain: HabitChain = {
          id: newChainId,
          name: sanitizedChainName,
          description: sanitizedChainDescription,
          habits: habits.map(h => ({
            ...h,
            name: sanitizeInput(h.name),
            description: sanitizeInput(h.description),
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
        toast({
          title: "Habit chain created",
          description: "Start building momentum with your new chain",
          duration: 3000,
        });
      }
      
      // Reset form and close modal
      setChainName('');
      setChainDescription('');
      setHabits([{ id: generateId(), name: '', description: '', position: 0 }]);
      onClose();
    } catch (error) {
      console.error('Error saving habit chain:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save habit chain",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50" onClick={onClose}></div>
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
          {/* Fixed header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {editingChain ? 'Edit Habit Chain' : 'Create Habit Chain'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Chain details section - fixed position */}
            <div className="p-4 space-y-4 flex-shrink-0 bg-white dark:bg-gray-800 sticky top-[65px] z-[5]">
              <div className="flex items-end gap-2">
                <div className="space-y-2 flex-1">
                  <label htmlFor="chainName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chain Name
                  </label>
                  <Input 
                    id="chainName"
                    value={chainName}
                    onChange={e => setChainName(e.target.value)}
                    placeholder="Morning Routine"
                    required
                    className="w-full dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                {editingChain && (
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon"
                    onClick={handleDeleteChain}
                    title="Delete chain"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="chainDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description (Optional)
                </label>
                <Textarea
                  id="chainDescription"
                  value={chainDescription}
                  onChange={e => setChainDescription(e.target.value)}
                  placeholder="My daily routine for productivity"
                  className="w-full dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                />
              </div>
            </div>
            
            {/* Scrollable habits section */}
            <div className="flex-1 overflow-auto px-4 pb-4 min-h-[100px] max-h-[40vh]">
              <div className="sticky top-0 py-2 bg-white dark:bg-gray-800 z-[4] border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Habits</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Will unlock in sequence</span>
                </div>
              </div>
              
              <div className="space-y-4 pt-3">
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
            
            {/* Fixed footer with action buttons */}
            <div className="flex space-x-3 p-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 sticky bottom-0 z-10">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingChain ? 'Save Changes' : 'Create Chain'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateHabitModal;
