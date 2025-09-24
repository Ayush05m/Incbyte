import React, { useState } from 'react';
import { useSweets, usePurchaseSweet, useUpdateSweetQuantity, useAddSweet, useUpdateSweet, useDeleteSweet } from '@/hooks/useSweets';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { SweetsToolbar } from '@/components/sweets/SweetsToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchParams, Sweet, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SweetFormDialog } from '@/components/sweets/SweetFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingSweetId, setDeletingSweetId] = useState<number | null>(null);

  const { data: sweets, isLoading, error } = useSweets(searchParams);
  const purchaseMutation = usePurchaseSweet();
  const updateQuantityMutation = useUpdateSweetQuantity();
  const addSweetMutation = useAddSweet();
  const updateSweetMutation = useUpdateSweet();
  const deleteSweetMutation = useDeleteSweet();

  const handleSearch = (params: SearchParams) => setSearchParams(params);
  const handlePurchase = async (sweetId: number) => {
    toast.promise(purchaseMutation.mutateAsync({ sweetId, quantity: 1 }), {
      loading: 'Processing purchase...',
      success: 'Purchase successful!',
      error: 'Purchase failed. Please try again.',
    });
  };
  const handleUpdateQuantity = (sweetId: number, newQuantity: number) => {
    updateQuantityMutation.mutate({ sweetId, newQuantity });
  };
  
  const handleOpenAddForm = () => {
    setEditingSweet(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateSweetDto | UpdateSweetDto) => {
    if (!editingSweet) {
      // This is a new sweet
      const action = addSweetMutation.mutateAsync(data as CreateSweetDto);
      toast.promise(action, {
        loading: 'Adding sweet...',
        success: `Sweet added successfully!`,
        error: `Failed to add sweet.`,
      });
      action.then(() => setIsFormOpen(false));
    } else {
      // This is an existing sweet
      const action = updateSweetMutation.mutateAsync({ sweetId: editingSweet.id, sweetData: data });
      toast.promise(action, {
        loading: 'Updating sweet...',
        success: `Sweet updated successfully!`,
        error: `Failed to update sweet.`,
      });
      action.then(() => setIsFormOpen(false));
    }
  };

  const handleOpenDeleteAlert = (sweetId: number) => {
    setDeletingSweetId(sweetId);
    setIsAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSweetId) return;
    toast.promise(deleteSweetMutation.mutateAsync(deletingSweetId), {
      loading: 'Deleting sweet...',
      success: 'Sweet deleted successfully!',
      error: 'Failed to delete sweet.',
    });
    setIsAlertOpen(false);
    setDeletingSweetId(null);
  };

  const isMutating = purchaseMutation.isPending || updateQuantityMutation.isPending || addSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Sweet Collection</h1>
          <p className="text-gray-600">Discover, purchase, and manage delicious sweets</p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenAddForm}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Sweet
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <SweetsToolbar onFilterChange={handleSearch} />
      </div>
      
      {isLoading && <LoadingSpinner />}
      {error && <div className="text-center text-red-500">Error loading sweets. Please try again later.</div>}
      {sweets && (
        <SweetGrid
          sweets={sweets}
          onPurchase={handlePurchase}
          onUpdateQuantity={handleUpdateQuantity}
          onEdit={handleOpenEditForm}
          onDelete={handleOpenDeleteAlert}
          isLoading={isMutating}
        />
      )}

      {isAdmin && (
        <SweetFormDialog
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          sweet={editingSweet}
          isSubmitting={addSweetMutation.isPending || updateSweetMutation.isPending}
        />
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sweet from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSweetId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;