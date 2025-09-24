import React, { useState } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

interface SweetSearchProps {
  onSearch: (params: SearchParams) => void;
}

export const SweetSearch: React.FC<SweetSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        type="text"
        placeholder="Search for sweets..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};