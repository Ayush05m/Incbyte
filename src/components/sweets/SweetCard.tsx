import React, { useState } from 'react';
import { ShoppingCart, Package, Plus, Minus, MoreVertical, Edit, Trash2, Star, Heart } from 'lucide-react';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweetId: number, quantity: number) => void;
  onUpdateQuantity: (sweetId: number, newQuantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onPurchase,
  onUpdateQuantity,
  onEdit,
  onDelete,
  isLoading = false,
  viewMode = 'grid'
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const displayQuantity = Math.max(0, sweet.quantity);
  const isOutOfStock = displayQuantity <= 0;
  const isLowStock = displayQuantity > 0 && displayQuantity < 10;

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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Cakes': 'from-pink-500 to-rose-500',
      'Pastries': 'from-orange-500 to-amber-500',
      'Candies': 'from-purple-500 to-violet-500',
      'Frozen': 'from-blue-500 to-cyan-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (isLowStock) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockStatus = getStockStatus();

  if (viewMode === 'list') {
    return (
      <Card 
        className={`
          overflow-hidden transition-all duration-300 transform-gpu
          ${isHovered ? 'shadow-xl scale-102' : 'shadow-md hover:shadow-lg'}
          ${isOutOfStock ? 'grayscale-50' : ''}
          bg-white/90 backdrop-blur-sm border-0 hover:bg-white/95
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={sweet.imageUrl || '/placeholder.svg'}
              alt={sweet.name}
              className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
            />
            <Badge className={`absolute top-1 right-1 text-xs ${stockStatus.bgColor} ${stockStatus.color} border-0`}>
              {stockStatus.text}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg text-gray-800">{sweet.name}</h3>
                <span className="text-xl font-bold text-green-600">₹{sweet.price.toFixed(2)}</span>
              </div>
              <Badge className={`mt-1 bg-gradient-to-r ${getCategoryColor(sweet.category)} text-white border-0 w-fit`}>
                {sweet.category}
              </Badge>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {sweet.description || 'A delightful sweet treat.'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center text-sm text-gray-500 gap-2">
                <Package className="w-4 h-4" />
                <span>{displayQuantity} in stock</span>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <>
                    <Button onClick={handleDecrease} disabled={isLoading || sweet.quantity <= 0} size="sm" variant="outline">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-bold w-8 text-center">{displayQuantity}</span>
                    <Button onClick={handleIncrease} disabled={isLoading} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      type="number"
                      min="1"
                      max={displayQuantity}
                      value={purchaseQuantity}
                      onChange={handleQuantityChange}
                      className="w-16 h-8 text-center text-sm"
                      disabled={isOutOfStock || isLoading}
                    />
                    <Button 
                      onClick={() => onPurchase(sweet.id, purchaseQuantity)} 
                      disabled={isOutOfStock || isLoading} 
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <Button onClick={() => onEdit(sweet)} size="sm" variant="outline" className="h-8 w-8 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button onClick={() => onDelete(sweet.id)} size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="group perspective-1000">
      <Card 
        className={`
          overflow-hidden transition-all duration-500 transform-gpu cursor-pointer
          ${isHovered ? 'shadow-2xl scale-105 -rotate-1' : 'shadow-lg hover:shadow-xl'}
          ${isOutOfStock ? 'grayscale-50' : ''}
          flex flex-col h-full bg-white/90 backdrop-blur-sm border-0
          hover:bg-white/95 relative
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg blur-sm -z-10"></div>
        
        <div className="relative overflow-hidden">
          <img
            src={sweet.imageUrl || '/placeholder.svg'}
            alt={sweet.name}
            className={`
              w-full h-48 object-cover transition-all duration-700 transform-gpu
              ${isHovered ? 'scale-110' : 'scale-100'}
              ${isOutOfStock ? 'grayscale' : ''}
            `}
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />

          {/* Floating elements */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge 
              className={`
                ${stockStatus.bgColor} ${stockStatus.color} border-0 shadow-lg
                transform transition-all duration-300
                ${isHovered ? 'scale-110 -rotate-3' : ''}
              `}
            >
              {stockStatus.text}
            </Badge>
            {isLowStock && !isOutOfStock && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 animate-pulse">
                Only {displayQuantity} left!
              </Badge>
            )}
          </div>

          {/* Like button */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className={`
                h-10 w-10 rounded-full transition-all duration-300 transform-gpu
                ${isLiked ? 'bg-red-100 text-red-500 scale-110' : 'bg-white/80 text-gray-400 hover:text-red-500'}
                ${isHovered ? 'scale-110' : ''}
              `}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart 
                className={`h-5 w-5 transition-all duration-300 ${isLiked ? 'fill-current animate-pulse' : ''}`} 
              />
            </Button>
          </div>

          {/* Admin menu */}
          {isAdmin && (
            <div className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2">
                  <DropdownMenuItem 
                    onClick={() => onEdit(sweet)}
                    className="hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(sweet.id)} 
                    className="hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && !isAdmin && (
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end justify-center pb-4">
              <div className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-full shadow-lg animate-bounce">
                Out of Stock
              </div>
            </div>
          )}

          {/* Hover overlay with quick actions */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/50 to-transparent
            flex items-center justify-center transition-all duration-300
            ${isHovered && !isOutOfStock && !isAdmin ? 'opacity-100' : 'opacity-0'}
          `}>
            <Button
              onClick={() => onPurchase(sweet.id, purchaseQuantity)}
              className="bg-white text-gray-800 hover:bg-gray-100 transform transition-all duration-300 hover:scale-110 shadow-lg"
              disabled={isOutOfStock || isLoading}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Buy
            </Button>
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className={`
              text-lg font-bold transition-all duration-300 line-clamp-1
              ${isHovered ? 'text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text' : 'text-gray-800'}
            `}>
              {sweet.name}
            </CardTitle>
            <div className="flex flex-col items-end gap-1">
              <span className={`
                text-xl font-bold transition-all duration-300
                ${isHovered ? 'text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text scale-110' : 'text-green-600'}
              `}>
                ₹{sweet.price.toFixed(2)}
              </span>
              {/* Star rating (mockup) */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-all duration-300`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              className={`
                bg-gradient-to-r ${getCategoryColor(sweet.category)} text-white border-0 shadow-md
                transition-all duration-300 transform-gpu
                ${isHovered ? 'scale-105 shadow-lg' : ''}
              `}
            >
              {sweet.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow pb-3">
          <p className={`
            text-sm text-gray-600 line-clamp-2 transition-all duration-300
            ${isHovered ? 'text-gray-700' : ''}
          `}>
            {sweet.description || 'A delightful sweet treat that will satisfy your cravings.'}
          </p>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Package className={`w-4 h-4 transition-colors duration-300 ${isHovered ? 'text-blue-500' : ''}`} />
            <span className={`transition-colors duration-300 ${isHovered ? 'text-gray-700 font-medium' : ''}`}>
              {displayQuantity} in stock
            </span>
          </div>
          
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleDecrease} 
                disabled={isLoading || sweet.quantity <= 0} 
                size="icon" 
                variant="outline"
                className="h-8 w-8 hover:scale-110 transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className={`
                font-bold w-8 text-center transition-all duration-300 text-lg
                ${isHovered ? 'text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text' : ''}
              `}>
                {displayQuantity}
              </span>
              <Button 
                onClick={handleIncrease} 
                disabled={isLoading} 
                size="icon" 
                variant="outline"
                className="h-8 w-8 hover:scale-110 transition-all duration-200 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max={displayQuantity}
                value={purchaseQuantity}
                onChange={handleQuantityChange}
                className={`
                  w-16 h-9 text-center border-2 transition-all duration-300
                  ${isHovered ? 'border-pink-300 focus:border-pink-400' : ''}
                  ${isOutOfStock ? 'opacity-50' : ''}
                `}
                disabled={isOutOfStock || isLoading}
              />
              <Button 
                onClick={() => onPurchase(sweet.id, purchaseQuantity)} 
                disabled={isOutOfStock || isLoading || purchaseQuantity > sweet.quantity} 
                size="sm"
                className={`
                  bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 
                  shadow-md hover:shadow-lg transition-all duration-300 transform-gpu
                  ${isHovered ? 'scale-110' : ''}
                  ${isLoading ? 'animate-pulse' : ''}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <ShoppingCart className="w-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardFooter>

        {/* Animated accent line */}
        <div className={`
          h-1 bg-gradient-to-r ${getCategoryColor(sweet.category)} transition-all duration-500 transform-gpu
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `}></div>
      </Card>
    </div>
  );
};