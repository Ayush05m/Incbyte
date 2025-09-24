import React from 'react';
import { Sweet } from '@/types/sweet.types';
import { SweetCard } from './SweetCard';

interface SweetGridProps {
  sweets: Sweet[];
  onPurchase: (sweetId: string) => void;
  onUpdateQuantity: (sweetId: string, newQuantity: number) => void;
  isLoading?: boolean;
}

export const SweetGrid: React.FC<SweetGridProps> = ({ sweets, onPurchase, onUpdateQuantity, isLoading }) => {
  if (sweets.length === 0) {
    return <p className="text-center text-gray-500">No sweets available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sweets.map((sweet) => (
        <SweetCard 
          key={sweet.id} 
          sweet={sweet} 
          onPurchase={onPurchase}
          onUpdateQuantity={onUpdateQuantity}
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
};