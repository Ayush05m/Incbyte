import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweetId: string) => void;
  isLoading?: boolean;
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onPurchase, 
  isLoading = false 
}) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative">
        <img
          src={sweet.imageUrl || '/placeholder.svg'}
          alt={sweet.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{sweet.name}</CardTitle>
          <span className="text-lg font-bold text-primary-600">
            ${sweet.price.toFixed(2)}
          </span>
        </div>
        <Badge variant="secondary">{sweet.category}</Badge>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-2">
          {sweet.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Package className="w-4 h-4 mr-1" />
          <span>{sweet.quantity} in stock</span>
        </div>
        
        <Button
          onClick={() => onPurchase(sweet.id)}
          disabled={isOutOfStock || isLoading}
          size="sm"
          className="flex items-center"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
};