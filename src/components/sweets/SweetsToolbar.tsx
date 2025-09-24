import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, X, DollarSign, Tag, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="p-4 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
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

      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Advanced Filters</span>
            </div>
            {hasActiveFilters && (
              <Badge variant="secondary">{activeFiltersCount} applied</Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-6 pt-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Category
              </label>
              {category && (
                <Button variant="ghost" size="sm" onClick={() => setCategory('')} className="h-auto p-1 text-xs">
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Price Range
              </label>
              {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <Button variant="ghost" size="sm" onClick={() => setPriceRange([0, MAX_PRICE])} className="h-auto p-1 text-xs">
                  Reset
                </Button>
              )}
            </div>
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

          {hasActiveFilters && (
            <>
              <Separator />
              <Button onClick={handleResetFilters} variant="ghost" className="w-full gap-2">
                <RefreshCcw className="h-4 w-4" />
                Reset All Filters
              </Button>
            </>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};