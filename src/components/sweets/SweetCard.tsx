import React, { useState } from 'react';
import { ShoppingCart, Package, MoreVertical, Edit, Trash2, Star, Heart, PackagePlus } from 'lucide-react';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cartStore';

interface SweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  onRestock: (sweet: Sweet) => void;
  isLoading?: boolean;
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onEdit,
  onDelete,
  onRestock,
  isLoading = false,
}) => {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const isAdmin = user?.role === 'admin';
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const displayQuantity = Math.max(0, sweet.quantity);
  const isOutOfStock = displayQuantity <= 0;
  const isLowStock = displayQuantity > 0 && displayQuantity < 10;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setPurchaseQuantity(1);
    } else if (value > displayQuantity) {
      setPurchaseQuantity(displayQuantity);
    } else {
      setPurchaseQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addItem(sweet, purchaseQuantity);
  };

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (isLowStock) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="group">
      <Card 
        className={`
          overflow-hidden transition-all duration-300 transform-gpu
          ${isHovered ? 'shadow-xl scale-[1.02]' : 'shadow-lg'}
          ${isOutOfStock ? 'opacity-80' : ''}
          flex flex-col h-full bg-white/90 backdrop-blur-sm border-0 relative
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img
            src={sweet.imageUrl || '/placeholder.svg'}
            alt={sweet.name}
            className={`
              w-full h-48 object-cover transition-transform duration-500
              ${isHovered ? 'scale-105' : 'scale-100'}
              ${isOutOfStock ? 'grayscale' : ''}
            `}
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />

          <div className="absolute top-3 left-3">
            <Badge 
              className={`${stockStatus.bgColor} ${stockStatus.color} border-0 shadow-md`}
            >
              {stockStatus.text}
            </Badge>
          </div>

          {isAdmin ? (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(sweet)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRestock(sweet)}>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    <span>Restock</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onDelete(sweet.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 rounded-full transition-colors duration-200 ${isLiked ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
              {sweet.name}
            </CardTitle>
            <span className="text-xl font-bold text-primary">
              ₹{sweet.price.toFixed(2)}
            </span>
          </div>
          <Badge variant="outline" className="w-fit">{sweet.category}</Badge>
        </CardHeader>
        
        <CardContent className="flex-grow pb-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            {sweet.description || 'A delightful sweet treat that will satisfy your cravings.'}
          </p>
        </CardContent>
        
        <CardFooter className="pt-3 border-t border-gray-100">
          {isAdmin ? (
            <div className="flex items-center text-sm text-gray-600 w-full">
              <Package className="w-4 h-4 mr-2" />
              <span>{displayQuantity} units in stock</span>
              {isLowStock && !isOutOfStock && (
                <Badge variant="outline" className="ml-auto bg-yellow-100 text-yellow-800 border-yellow-200">
                  Low Stock
                </Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Input
                type="number"
                min="1"
                max={displayQuantity}
                value={purchaseQuantity}
                onChange={handleQuantityChange}
                className="w-16 h-9 text-center"
                disabled={isOutOfStock || isLoading}
              />
              <Button 
                onClick={handleAddToCart} 
                disabled={isOutOfStock || isLoading || purchaseQuantity > sweet.quantity} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};