import React from 'react';
import { Sweet } from '@/types/sweet.types';
import { SweetCard } from './SweetCard';

interface SweetGridProps {
  sweets: Sweet[];
  onPurchase: (sweetId: string) => void;
  onUpdateQuantity: (sweetId: string, newQuantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: string) => void;
  isLoading?: boolean;
}

export const SweetGrid: React.FC<SweetGridProps> = ({ sweets, onPurchase, onUpdateQuantity, onEdit, onDelete, isLoading }) => {
  if (sweets.length === 0) {
    return <p className="text-center text-gray-500 py-10">No sweets match your criteria.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {sweets.map((sweet) => (
        <SweetCard 
          key={sweet.id} 
          sweet={sweet} 
          onPurchase={onPurchase}
          onUpdateQuantity={onUpdateQuantity}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
};