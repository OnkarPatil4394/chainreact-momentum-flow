
import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { HabitChain as HabitChainType } from '../types/types';
import Header from '../components/Header';
import HabitChain from '../components/HabitChain';
import ProgressSection from '../components/ProgressSection';
import CreateHabitModal from '../components/CreateHabitModal';
import HowToUse from '../components/HowToUse';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [chains, setChains] = useState<HabitChainType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<HabitChainType | undefined>(undefined);
  
  // Load chains from database
  const loadChains = () => {
    setChains(db.getChains());
  };
  
  useEffect(() => {
    loadChains();
  }, []);
  
  const handleOpenCreateModal = () => {
    setEditingChain(undefined);
    setIsCreateModalOpen(true);
  };
  
  const handleOpenEditModal = (chain: HabitChainType) => {
    setEditingChain(chain);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingChain(undefined);
    loadChains(); // Refresh chains after modal is closed
  };
  
  const handleChainUpdate = () => {
    loadChains();
  };
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Today's date */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{currentDate}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your daily habit chains</p>
        </div>
        
        {/* How to use section */}
        <HowToUse />
        
        {/* Progress section */}
        <ProgressSection />
        
        {/* Add new chain button */}
        <div className="mb-6">
          <Button 
            onClick={handleOpenCreateModal}
            className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Create New Habit Chain
          </Button>
        </div>
        
        {/* Habit chains */}
        {chains.length > 0 ? (
          <div className="space-y-4">
            {chains.map(chain => (
              <HabitChain 
                key={chain.id} 
                chain={chain}
                onEdit={() => handleOpenEditModal(chain)} 
                onUpdate={handleChainUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No habit chains created yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Create your first chain to start building momentum!
            </p>
          </div>
        )}
      </main>
      
      {/* Create/Edit habit modal */}
      <CreateHabitModal 
        open={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
        editingChain={editingChain} 
      />
    </div>
  );
};

export default Index;
