import React, { useState } from 'react';
import { ShoppingCart, Package, Plus, Minus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';

interface SweetCardProps {
  sweet: Sweet;
  onUpdateQuantity: (sweetId: number, newQuantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  isLoading?: boolean;
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onUpdateQuantity,
  onEdit,
  onDelete,
  isLoading = false 
}) => {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const isAdmin = user?.role === 'admin';
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  
  const displayQuantity = Math.max(0, sweet.quantity);
  const isOutOfStock = displayQuantity <= 0;

  const handleIncrease = () => onUpdateQuantity(sweet.id, sweet.quantity + 1);
  const handleDecrease = () => {
    if (sweet.quantity > 0) onUpdateQuantity(sweet.id, sweet.quantity - 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setPurchaseQuantity(1);
    } else if (value > displayQuantity) {
      setPurchaseQuantity(displayQuantity);
    } else if (value < 1) {
      setPurchaseQuantity(1);
    } else {
      setPurchaseQuantity(value);
    }
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
          <span className="text-lg font-bold text-primary-600">₹{sweet.price.toLocaleString('en-IN')}</span>
        </div>
        <Badge variant="secondary">{sweet.category}</Badge>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-2">{sweet.description}</p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Package className="w-4 h-4 mr-1" />
          <span>{displayQuantity} in stock</span>
        </div>
        
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <Button onClick={handleDecrease} disabled={isLoading || sweet.quantity <= 0} size="icon" variant="outline"><Minus className="w-4 h-4" /></Button>
            <span className="font-semibold w-8 text-center">{displayQuantity}</span>
            <Button onClick={handleIncrease} disabled={isLoading} size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max={displayQuantity}
              value={purchaseQuantity}
              onChange={handleQuantityChange}
              className="w-16 h-9 text-center"
              disabled={isOutOfStock || isLoading}
            />
            <Button onClick={() => addItem(sweet, purchaseQuantity)} disabled={isOutOfStock || isLoading || purchaseQuantity > sweet.quantity} size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};