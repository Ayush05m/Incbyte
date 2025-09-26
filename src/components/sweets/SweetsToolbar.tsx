import React, { useState, useEffect } from 'react';
import { SearchParams } from '@/types/sweet.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, DollarSign, Tag } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';

interface SweetsToolbarProps {
  onFilterChange: (params: SearchParams) => void;
}

const CATEGORIES = ["Cakes", "Pastries", "Candies", "Frozen"];
const MAX_PRICE = 50;
const PRESET_RANGES = [
  { label: "Budget", range: [0, 10] as [number, number] },
  { label: "Mid-range", range: [10, 25] as [number, number] },
  { label: "Premium", range: [25, 50] as [number, number] }
];

export const SweetsToolbar: React.FC<SweetsToolbarProps> = ({ onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  
  const debouncedQuery = useDebounce(query, 300);

  const isPriceDefault = priceRange[0] === 0 && priceRange[1] === MAX_PRICE;
  const activeFiltersCount = [debouncedQuery, category, !isPriceDefault].filter(Boolean).length;

  useEffect(() => {
    const params: SearchParams = {};
    if (debouncedQuery) params.query = debouncedQuery;
    if (category) params.category = category;
    if (!isPriceDefault) {
      params.priceRange = priceRange;
    }
    onFilterChange(params);
  }, [debouncedQuery, category, priceRange, onFilterChange, isPriceDefault]);

  const handleReset = () => {
    setQuery('');
    setCategory('');
    setPriceRange([0, MAX_PRICE]);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(prev => prev === cat ? '' : cat);
  };

  const priceDisplay = isPriceDefault ? 'Price' : `₹${priceRange[0]} - ₹${priceRange[1]}`;

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="flex flex-col md:flex-row items-center gap-3 p-3 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/80"
    >
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 text-base border-2 border-transparent focus:border-pink-300 focus:bg-white transition-all duration-300 rounded-xl bg-gray-50/80"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={category ? "default" : "outline"} className="w-full md:w-auto h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{category || 'Category'}</span>
            {category && (
              <motion.div whileHover={{ scale: 1.2, rotate: 90 }} onClick={(e) => { e.stopPropagation(); setCategory(''); }}>
                <X className="h-4 w-4 opacity-70 hover:opacity-100" />
              </motion.div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "ghost"}
                onClick={() => handleCategorySelect(cat)}
                className="w-full justify-start"
              >
                {cat}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={!isPriceDefault ? "default" : "outline"} className="w-full md:w-auto h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{priceDisplay}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="text-center font-medium text-gray-700">
              Price Range: <span className="font-bold text-primary">₹{priceRange[0]} - ₹{priceRange[1]}</span>
            </div>
            <Slider
              min={0}
              max={MAX_PRICE}
              step={1}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>₹0</span>
              <span>₹{MAX_PRICE}</span>
            </div>
            <div className="flex gap-2">
              {PRESET_RANGES.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceRange(preset.range)}
                  className="flex-1"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFiltersCount > 0 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Button 
            variant="ghost" 
            onClick={handleReset} 
            className="h-12 w-12 p-0 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            aria-label="Clear filters"
          >
            <div className="relative">
              <X className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            </div>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};