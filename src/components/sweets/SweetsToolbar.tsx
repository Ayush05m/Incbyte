import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, X, DollarSign, Tag, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface SweetsToolbarProps {
  onFilterChange: (params: SearchParams) => void;
}

const CATEGORIES = ["Cakes", "Pastries", "Candies", "Frozen"];
const MAX_PRICE = 5000;

export const SweetsToolbar: React.FC<SweetsToolbarProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  
  const debouncedQuery = useDebounce(query, 300);

  const activeFiltersCount = [
    category,
    priceRange[0] > 0 || priceRange[1] < MAX_PRICE
  ].filter(Boolean).length;

  useEffect(() => {
    const params: SearchParams = {};
    if (debouncedQuery) params.query = debouncedQuery;
    if (category) params.category = category;
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) {
      params.priceRange = priceRange;
    }
    onFilterChange(params);
  }, [debouncedQuery, category, priceRange, onFilterChange]);

  const handleResetFilters = () => {
    setCategory('');
    setPriceRange([0, MAX_PRICE]);
  };

  return (
    <div className="p-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sweets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-9"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center p-0 text-xs rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="end">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium leading-none">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button onClick={handleResetFilters} variant="ghost" size="sm" className="h-auto p-1 text-xs gap-1">
                    <RefreshCcw className="h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>
              <Separator />
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setCategory(cat === category ? '' : cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Price Range Filter */}
              <div className="space-y-3">
                <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </label>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};