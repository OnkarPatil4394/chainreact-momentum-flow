
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Check } from 'lucide-react';
import { languages } from '@/data/languages';
import { Language } from '@/types/types';

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageSelect: (languageCode: string) => void;
  showSearch?: boolean;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage = 'en',
  onLanguageSelect,
  showSearch = true,
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return languages;
    
    const term = searchTerm.toLowerCase();
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(term) ||
      lang.nativeName.toLowerCase().includes(term) ||
      lang.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} max-h-96 overflow-y-auto`}>
        {filteredLanguages.map((language) => (
          <Card
            key={language.code}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedLanguage === language.code 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => onLanguageSelect(language.code)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {language.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language.nativeName}
                    </div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No languages found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
