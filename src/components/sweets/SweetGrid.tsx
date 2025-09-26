import React from 'react';
import { Sweet } from '@/types/sweet.types';
import { SweetCard } from './SweetCard';
import { useAuthStore } from '@/store/authStore';
import { Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SweetGridProps {
  sweets: Sweet[];
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweetId: number) => void;
  onRestock: (sweet: Sweet) => void;
  isLoading?: boolean;
  isFiltered: boolean;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
    },
  },
};

export const SweetGrid: React.FC<SweetGridProps> = ({ 
  sweets, 
  onEdit, 
  onDelete, 
  onRestock,
  isLoading, 
  isFiltered 
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  if (sweets.length === 0) {
    let message = "No sweets available at the moment.";
    let subtitle = "Check back later for delicious treats!";
    
    if (isFiltered) {
      message = "No sweets match your criteria.";
      subtitle = "Try adjusting your filters to discover more delights.";
    } else if (isAdmin) {
      message = "No sweets available yet.";
      subtitle = "Why not add your first delicious creation?";
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="relative mb-8">
          <Package className="h-24 w-24 text-gray-300 mx-auto" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full animate-pulse opacity-30 blur-xl"></div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2 bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
          {message}
        </h3>
        <p className="text-gray-500 text-lg max-w-md">
          {subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
      </div>

      <motion.div 
        className="sweets-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {sweets.map((sweet) => (
          <motion.div
            key={sweet.id}
            variants={gridItemVariants}
          >
            <SweetCard 
              sweet={sweet} 
              onEdit={onEdit}
              onDelete={onDelete}
              onRestock={onRestock}
              isLoading={isLoading} 
            />
          </motion.div>
        ))}
      </motion.div>

      {sweets.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-float opacity-20"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-delayed opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full animate-float opacity-25"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float-delayed opacity-20"></div>
        </div>
      )}
    </div>
  );
};