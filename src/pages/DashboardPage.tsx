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
  const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);

  const { data: sweets, isLoading, error, refetch } = useSweets(searchParams);
  const purchaseMutation = usePurchaseSweet();
  const updateQuantityMutation = useUpdateSweetQuantity(searchParams);
  const addSweetMutation = useAddSweet();
  const updateSweetMutation = useUpdateSweet();
  const deleteSweetMutation = useDeleteSweet();

  const handleSearch = (params: SearchParams) => setSearchParams(params);
  
  const handlePurchase = async (sweetId: number, quantity: number) => {
    const sweet = sweets?.find(s => s.id === sweetId);
    toast.promise(purchaseMutation.mutateAsync({ sweetId, quantity }), {
      loading: 'Processing purchase...',
      success: `Successfully purchased ${quantity} of ${sweet?.name || 'a sweet'}!`,
      error: (err: any) => err?.response?.data?.message || 'Purchase failed. Please try again.',
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
      const action = addSweetMutation.mutateAsync(data as CreateSweetDto);
      toast.promise(action, {
        loading: 'Adding sweet...',
        success: `Sweet added successfully!`,
        error: `Failed to add sweet.`,
      });
      action.then(() => setIsFormOpen(false));
    } else {
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
    const sweet = sweets?.find(s => s.id === sweetId);
    if (sweet) {
      setSweetToDelete(sweet);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!sweetToDelete) return;
    toast.promise(deleteSweetMutation.mutateAsync(sweetToDelete.id), {
      loading: `Deleting ${sweetToDelete.name}...`,
      success: `${sweetToDelete.name} deleted successfully!`,
      error: `Failed to delete ${sweetToDelete.name}.`,
    });
    setSweetToDelete(null);
  };

  const isMutating = purchaseMutation.isPending || addSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending;
  const isFiltered = Object.keys(searchParams).length > 0;

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
      {error && (
        <div className="text-center text-red-500 py-10">
          <p>Error loading sweets. Please try again later.</p>
          <Button onClick={() => refetch()} className="mt-4">Retry</Button>
        </div>
      )}
      {!isLoading && !error && sweets && (
        <SweetGrid
          sweets={sweets}
          onPurchase={handlePurchase}
          onUpdateQuantity={handleUpdateQuantity}
          onEdit={handleOpenEditForm}
          onDelete={handleOpenDeleteAlert}
          isLoading={isMutating}
          isFiltered={isFiltered}
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

      <AlertDialog open={!!sweetToDelete} onOpenChange={(open) => !open && setSweetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{sweetToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sweet from the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardPage;