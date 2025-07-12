
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check, Globe } from 'lucide-react';
import { languages } from '@/data/languages';
import { Language } from '@/types/types';

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageSelect: (languageCode: string) => void;
  showSearch?: boolean;
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = React.memo(({
  selectedLanguage = 'en',
  onLanguageSelect,
  showSearch = true,
  compact = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchTerm.trim()) return languages;
    
    const term = searchTerm.toLowerCase().trim();
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(term) ||
      lang.nativeName.toLowerCase().includes(term) ||
      lang.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const getSelectedLanguage = useCallback(() => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[0];
  }, [selectedLanguage]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleLanguageChange = useCallback((languageCode: string) => {
    onLanguageSelect(languageCode);
    console.log('Language changed to:', languageCode);
  }, [onLanguageSelect]);

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search languages..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      )}

      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getSelectedLanguage().flag}</span>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getSelectedLanguage().name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {getSelectedLanguage().nativeName}
                </div>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {filteredLanguages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700"
            >
              <div className="flex items-center space-x-3 w-full">
                <span className="text-xl">{language.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {language.nativeName}
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filteredLanguages.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No languages found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
