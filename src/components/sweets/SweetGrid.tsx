import React from 'react';
import { Sweet } from '@/types/sweet.types';
import { SweetCard } from './SweetCard';
import { useAuthStore } from '@/store/authStore';

interface SweetGridProps {
  sweets: Sweet[];
  onPurchase: (sweetId: number, quantity: number) => void;
  onUpdateQuantity: (sweetId: number, newQuantity: number) => void;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  isLoading?: boolean;
  isFiltered: boolean;
}

export const SweetGrid: React.FC<SweetGridProps> = ({ sweets, onPurchase, onUpdateQuantity, onEdit, onDelete, isLoading, isFiltered }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (sweets.length === 0) {
    let message = "No sweets available at the moment.";
    if (isFiltered) {
      message = "No sweets match your criteria.";
    } else if (isAdmin) {
      message = "No sweets available yet. Why not add one?";
    }
    return <p className="text-center text-gray-500 py-10">{message}</p>;
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