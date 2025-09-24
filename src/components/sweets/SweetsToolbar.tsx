import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, DollarSign, Tag, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  const activeFiltersCount = [
    debouncedQuery,
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

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setPriceRange([0, MAX_PRICE]);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === 'all' ? '' : value);
  };

  const hasFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-11 text-base border-gray-300 focus:border-primary transition-colors duration-200"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle and Reset */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
          {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {hasFilters && (
          <Button 
            onClick={handleReset} 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-gray-600 hover:text-red-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isAdvancedOpen 
          ? 'max-h-[500px] opacity-100' 
          : 'max-h-0 opacity-0'
        }
      `}>
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-600" />
                <label className="font-medium text-gray-800">Category</label>
              </div>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <label className="font-medium text-gray-800">Price Range</label>
                </div>
                <span className="text-sm font-semibold text-primary">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </span>
              </div>
              <Slider
                min={0}
                max={MAX_PRICE}
                step={1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};