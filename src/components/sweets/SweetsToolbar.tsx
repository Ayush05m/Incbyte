import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SweetsToolbarProps {
  onFilterChange: (params: SearchParams) => void;
}

const CATEGORIES = ["Cakes", "Pastries", "Candies", "Frozen"];
const MAX_PRICE = 50;

export const SweetsToolbar: React.FC<SweetsToolbarProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params: SearchParams = {};
    if (debouncedQuery) params.query = debouncedQuery;
    if (category) params.category = category;
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) {
      params.priceRange = priceRange;
    }
    onFilterChange(params);
  }, [debouncedQuery, category, priceRange, onFilterChange]);

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setPriceRange([0, MAX_PRICE]);
  };

  const handleCategoryChange = (value: string) => {
    // If the user selects 'all', we set the category state to an empty string to clear the filter.
    setCategory(value === 'all' ? '' : value);
  };

  return (
    <div className="p-4 bg-card rounded-lg border space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="Search for sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Select value={category || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="w-full sm:w-[200px] space-y-2">
          <label className="text-sm font-medium">Price: ${priceRange[0]} - ${priceRange[1]}</label>
          <Slider
            min={0}
            max={MAX_PRICE}
            step={1}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
          />
        </div>
      </div>
      <Button onClick={handleReset} variant="ghost" size="sm">
        <X className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};