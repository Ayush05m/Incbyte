import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, DollarSign, Tag, RefreshCcw, TrendingUp, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SweetsToolbarProps {
  onFilterChange: (params: SearchParams) => void;
}

const CATEGORIES = ["Cakes", "Pastries", "Candies", "Frozen"];
const MAX_PRICE = 50;
const PRESET_RANGES = [
  { label: "Budget", range: [0, 10] as [number, number], icon: "💰", color: "from-green-400 to-emerald-400" },
  { label: "Mid-range", range: [10, 25] as [number, number], icon: "⭐", color: "from-blue-400 to-indigo-400" },
  { label: "Premium", range: [25, 50] as [number, number], icon: "💎", color: "from-purple-400 to-pink-400" }
];

export const SweetsToolbar: React.FC<SweetsToolbarProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
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
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Search Bar */}
      <div className="relative group">
        <div className={`
          absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500
          ${isSearchFocused ? 'opacity-30' : ''}
        `}></div>
        
        <div className="relative">
          <Search className={`
            absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300
            ${isSearchFocused ? 'text-pink-500 scale-110' : 'text-gray-400'}
          `} />
          <Input
            type="text"
            placeholder="Search for your favorite sweets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`
              pl-12 pr-12 h-14 text-base border-2 transition-all duration-300 bg-white/90 backdrop-blur-sm
              ${isSearchFocused 
                ? 'border-pink-300 shadow-lg scale-105 bg-white' 
                : 'border-gray-200 hover:border-pink-200 shadow-md'
              }
              rounded-xl
            `}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
              className={`
                absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 
                hover:bg-red-100 hover:text-red-600 rounded-full transition-all duration-200
                ${query ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
              `}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Search suggestions indicator */}
          {query && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border animate-slide-down">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Searching for "{query}"...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`
            gap-3 h-12 px-6 transition-all duration-300 transform-gpu
            ${isAdvancedOpen 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105' 
              : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105'
            }
            border-2 rounded-xl
          `}
        >
          <Filter className={`h-5 w-5 transition-transform duration-300 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
          <span className="font-medium">Advanced Filters</span>
          {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className={`
                ml-1 transition-all duration-300
                ${isAdvancedOpen 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-r from-pink-500 to-orange-500 text-white animate-pulse'
                }
              `}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {hasFilters && (
          <Button 
            onClick={handleReset} 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-105 rounded-lg"
          >
            <RefreshCcw className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Enhanced Advanced Filters Panel */}
      <div className={`
        transition-all duration-500 transform-gpu overflow-hidden
        ${isAdvancedOpen 
          ? 'max-h-screen opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-4'
        }
      `}>
        <Card className="border-2 border-gradient-to-r from-orange-200 to-pink-200 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 shadow-xl">
          <CardContent className="p-8 space-y-8">
            {/* Enhanced Category Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-md">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Category Selection
                    {category && (
                      <Badge 
                        variant="outline" 
                        className="bg-orange-100 text-orange-800 border-orange-300 animate-bounce"
                      >
                        {category}
                      </Badge>
                    )}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">Choose your favorite sweet category</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Button
                  variant={!category ? "default" : "outline"}
                  size="lg"
                  onClick={() => setCategory('')}
                  className={`
                    h-12 transition-all duration-300 transform-gpu rounded-xl
                    ${!category 
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg scale-105" 
                      : "hover:bg-orange-50 hover:border-orange-300 hover:scale-105"
                    }
                  `}
                >
                  <span className="font-medium">All Categories</span>
                </Button>
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="lg"
                    onClick={() => setCategory(cat)}
                    className={`
                      h-12 transition-all duration-300 transform-gpu rounded-xl
                      ${category === cat 
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg scale-105" 
                        : "hover:bg-orange-50 hover:border-orange-300 hover:scale-105"
                      }
                    `}
                  >
                    <span className="font-medium">{cat}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Enhanced Price Range Filter */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                    {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                      <Badge 
                        variant="outline" 
                        className="bg-green-100 text-green-800 border-green-300 animate-bounce"
                      >
                        Custom Range
                      </Badge>
                    )}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">Find sweets within your budget</p>
                </div>
              </div>

              {/* Preset Ranges with Enhanced Design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRESET_RANGES.map(preset => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="lg"
                    onClick={() => handlePresetRange(preset.range)}
                    className={`
                      h-16 p-4 transition-all duration-300 transform-gpu rounded-xl border-2
                      ${
                        priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                          ? `bg-gradient-to-r ${preset.color} text-white shadow-lg scale-105 border-transparent`
                          : "hover:bg-green-50 hover:border-green-300 hover:scale-105"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{preset.icon}</span>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span className="font-bold">{preset.label}</span>
                      <span className="text-sm opacity-80">${preset.range[0]}-${preset.range[1]}</span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Enhanced Custom Slider */}
              <div className="px-4 py-6 bg-white/60 rounded-xl border border-green-200">
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Custom Price Range</span>
                </div>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={1}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full mb-4"
                />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-500">Min</span>
                    <span className="font-bold text-green-600">${priceRange[0]}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Sparkles className="h-3 w-3 text-yellow-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-500">Max</span>
                    <span className="font-bold text-green-600">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filter Summary */}
            {hasFilters && (
              <div className="pt-6 border-t border-orange-200 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Filter className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-800">Active Filters</span>
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white animate-pulse"
                    >
                      {activeFiltersCount} applied
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {query && (
                    <Badge 
                      variant="outline" 
                      className="bg-blue-50 text-blue-700 border-blue-300 px-3 py-2 text-sm hover:bg-blue-100 transition-colors duration-200 rounded-lg"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Search: "{query.substring(0, 20)}{query.length > 20 ? '...' : ''}"
                    </Badge>
                  )}
                  {category && (
                    <Badge 
                      variant="outline" 
                      className="bg-orange-50 text-orange-700 border-orange-300 px-3 py-2 text-sm hover:bg-orange-100 transition-colors duration-200 rounded-lg"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      Category: {category}
                    </Badge>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 text-green-700 border-green-300 px-3 py-2 text-sm hover:bg-green-100 transition-colors duration-200 rounded-lg"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Price: ${priceRange[0]}-${priceRange[1]}
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Filters help you find the perfect sweet faster! ✨
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 hover:scale-105 rounded-lg"
                  >
                    <RefreshCcw className="h-3 w-3 mr-2" />
                    Reset All
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};