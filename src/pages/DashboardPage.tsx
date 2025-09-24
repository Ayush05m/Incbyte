import React, { useState } from 'react';
import { useSweets, usePurchaseSweet } from '@/hooks/useSweets';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { SweetSearch } from '@/components/sweets/SweetSearch';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchParams } from '@/types/sweet.types';
import { toast } from 'sonner';

const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const { data: sweets, isLoading, error } = useSweets(searchParams);
  const purchaseMutation = usePurchaseSweet();

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handlePurchase = async (sweetId: string) => {
    try {
      await purchaseMutation.mutateAsync({ sweetId, quantity: 1 });
      toast.success("Purchase successful!");
    } catch (err) {
      toast.error("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Our Sweet Collection
        </h1>
        <p className="text-gray-600">
          Discover and purchase delicious sweets
        </p>
      </div>
      
      <div className="mb-6 max-w-lg mx-auto">
        <SweetSearch onSearch={handleSearch} />
      </div>
      
      {isLoading && <LoadingSpinner />}
      {error && <div className="text-center text-red-500">Error loading sweets. Please try again later.</div>}
      {sweets && (
        <SweetGrid
          sweets={sweets}
          onPurchase={handlePurchase}
          isLoading={purchaseMutation.isPending}
        />
      )}
    </div>
  );
};

export default DashboardPage;