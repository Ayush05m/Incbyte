import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, DollarSign, Tag, RefreshCcw, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SweetsToolbarProps {
  onFilterChange: (params: SearchParams) => void;
}

const CATEGORIES = ["Cakes", "Pastries", "Candies", "Frozen"];
const MAX_PRICE = 5000;
const PRESET_RANGES = [
  { label: "Budget", range: [0, 500] as [number, number] },
  { label: "Mid-range", range: [500, 2000] as [number, number] },
  { label: "Premium", range: [2000, 5000] as [number, number] }
];

export const SweetsToolbar: React.FC<SweetsToolbarProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  // Track active filters count
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

  const handlePresetRange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const hasFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search sweets by name or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 h-12 text-base border-2 focus:border-orange-300 transition-colors"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {hasFilters && (
          <Button onClick={handleReset} variant="ghost" size="sm" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isAdvancedOpen && (
        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-pink-50">
          <CardContent className="p-6 space-y-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-orange-600" />
                <label className="text-sm font-semibold text-gray-700">Category</label>
                {category && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    {category}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <Button
                  variant={!category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory('')}
                  className={!category ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  All Categories
                </Button>
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={category === cat ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <label className="text-sm font-semibold text-gray-700">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Custom Range
                  </Badge>
                )}
              </div>

              {/* Preset Ranges */}
              <div className="flex flex-wrap gap-2">
                {PRESET_RANGES.map(preset => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetRange(preset.range)}
                    className={
                      priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                        ? "bg-green-100 border-green-300 text-green-700"
                        : "hover:bg-green-50"
                    }
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {preset.label} (₹{preset.range[0]}-₹{preset.range[1]})
                  </Button>
                ))}
              </div>

              {/* Custom Slider */}
              <div className="px-3">
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={1}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹{MAX_PRICE}</span>
                </div>
              </div>
            </div>

            {/* Filter Summary */}
            {hasFilters && (
              <div className="pt-4 border-t border-orange-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {query && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Search: "{query.substring(0, 20)}{query.length > 20 ? '...' : ''}"
                      </Badge>
                    )}
                    {category && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Category: {category}
                      </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Price: ₹{priceRange[0]}-₹{priceRange[1]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};