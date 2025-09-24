import React from 'react';
import { ShoppingCart, Package, Plus, Minus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweetId: number) => void;
  onUpdateQuantity: (sweetId: number, newQuantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  isLoading?: boolean;
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onPurchase,
  onUpdateQuantity,
  onEdit,
  onDelete,
  isLoading = false 
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isOutOfStock = sweet.quantity === 0;

  const handleIncrease = () => onUpdateQuantity(sweet.id, sweet.quantity + 1);
  const handleDecrease = () => {
    if (sweet.quantity > 0) onUpdateQuantity(sweet.id, sweet.quantity - 1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative">
        <img
          src={sweet.imageUrl || '/placeholder.svg'}
          alt={sweet.name}
          className="w-full h-48 object-cover"
          onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
        />
        {isAdmin && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(sweet)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(sweet.id)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {isOutOfStock && !isAdmin && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{sweet.name}</CardTitle>
          <span className="text-lg font-bold text-primary-600">${sweet.price.toFixed(2)}</span>
        </div>
        <Badge variant="secondary">{sweet.category}</Badge>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-2">{sweet.description}</p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Package className="w-4 h-4 mr-1" />
          <span>{sweet.quantity} in stock</span>
        </div>
        
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Button onClick={handleDecrease} disabled={isLoading || sweet.quantity === 0} size="icon" variant="outline"><Minus className="w-4 h-4" /></Button>
            <span className="font-semibold w-8 text-center">{sweet.quantity}</span>
            <Button onClick={handleIncrease} disabled={isLoading} size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
          </div>
        ) : (
          <Button onClick={() => onPurchase(sweet.id)} disabled={isOutOfStock || isLoading} size="sm">
            <ShoppingCart className="w-4 h-4 mr-1" />
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};