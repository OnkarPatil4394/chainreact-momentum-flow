
/**
 * © 2025 Vaion Developers. ChainReact — Free Forever, Not Yours to Rebrand.
 */
import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer vaion-trust bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <Shield size={12} className="mr-1" />
          <span>Built by Vaion Developers — Free Forever. No ads. No tracking.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
