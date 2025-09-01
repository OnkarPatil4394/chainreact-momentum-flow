/**
 * © 2025 Vaion Developers. ChainReact — Free Forever, Not Yours to Rebrand.
 */
import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { HabitChain as HabitChainType } from '../types/types';
import Header from '../components/Header';
import HabitChain from '../components/HabitChain';
import ProgressSection from '../components/ProgressSection';
import CreateHabitModal from '../components/CreateHabitModal';
import HowToUse from '../components/HowToUse';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SEO from '@/components/SEO';

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
  
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ChainReact",
    "description": "Transform your life with ChainReact, the ultimate habit tracking app. Build powerful daily routines, track streaks, and create lasting positive change through consistent habit formation.",
    "url": window.location.origin,
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Daily habit tracking",
      "Streak counters",
      "Progress analytics",
      "Customizable habit chains",
      "Dark mode support"
    ]
  };

  return (
    <>
      <SEO 
        title="ChainReact - Build momentum. One habit at a time."
        description="Transform your life with ChainReact, the ultimate habit tracking app. Build powerful daily routines, track streaks, and create lasting positive change through consistent habit formation."
        keywords="habit tracker, daily habits, streak counter, routine builder, productivity app, habit formation, personal development, goal tracking, habit chains, motivation app"
        structuredData={homeStructuredData}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 vaion-trust">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Today's date - SEO optimized header */}
        <header className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Daily Habit Tracker - {currentDate}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Build momentum with your daily habit chains</p>
        </header>
        
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
        
        <Footer />
      
      {/* Create/Edit habit modal */}
      <CreateHabitModal 
        open={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
        editingChain={editingChain} 
        />
      </div>
    </>
  );
};

export default Index;
