import React, { useState, useMemo, useCallback } from 'react';
import { useSweets, useAddSweet, useUpdateSweet, useDeleteSweet, useRestockSweet } from '@/hooks/useSweets';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { SweetsToolbar } from '@/components/sweets/SweetsToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchParams, Sweet, SweetFormData } from '@/types/sweet.types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  TrendingUp, 
  AlertTriangle,
  RefreshCcw,
  X
} from 'lucide-react';
import { SweetFormDialog } from '@/components/sweets/SweetFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RestockDialog } from '@/components/sweets/RestockDialog';
import { StatsDrawer } from '@/components/dashboard/StatsDrawer';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);
  const [isStatsDrawerOpen, setIsStatsDrawerOpen] = useState(false);

  const { data: sweets, isLoading, error, refetch } = useSweets(searchParams);
  const addSweetMutation = useAddSweet();
  const updateSweetMutation = useUpdateSweet();
  const deleteSweetMutation = useDeleteSweet();
  const restockMutation = useRestockSweet();

  const stats = useMemo(() => {
    if (!sweets?.length) return null;

    const totalSweets = sweets.length;
    const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
    const lowStockItems = sweets.filter(sweet => sweet.quantity < 10).length;
    const categories = [...new Set(sweets.map(sweet => sweet.category))].length;
    const averagePrice = sweets.reduce((sum, sweet) => sum + sweet.price, 0) / totalSweets;

    return {
      totalSweets,
      totalValue,
      lowStockItems,
      categories,
      averagePrice
    };
  }, [sweets]);

  const handleSearch = useCallback((params: SearchParams) => setSearchParams(params), []);
  
  const handleOpenAddForm = () => {
    setEditingSweet(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: SweetFormData) => {
    const isEditing = !!editingSweet;
    const action = isEditing
      ? updateSweetMutation.mutateAsync({ sweetId: editingSweet!.id, sweetData: data })
      : addSweetMutation.mutateAsync(data);

    toast.promise(action, {
      loading: isEditing ? 'Updating sweet...' : 'Adding sweet...',
      success: () => {
        setIsFormOpen(false);
        return `Sweet ${isEditing ? 'updated' : 'added'} successfully!`;
      },
      error: (err: any) => err?.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} sweet.`,
    });
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
      error: (err: any) => err?.response?.data?.message || `Failed to delete ${sweetToDelete.name}.`,
    });

    setSweetToDelete(null);
  };

  const handleOpenRestockDialog = (sweet: Sweet) => {
    setRestockingSweet(sweet);
  };

  const handleRestockSubmit = (quantityToAdd: number) => {
    if (!restockingSweet) return;

    const promise = restockMutation.mutateAsync({ sweetId: restockingSweet.id, quantity: quantityToAdd });

    toast.promise(promise, {
      loading: 'Restocking sweet...',
      success: (updatedSweet: Sweet) => `Successfully added ${quantityToAdd} units. New total is ${updatedSweet.quantity}.`,
      error: (err: any) => err?.response?.data?.message || 'Failed to restock sweet.',
    });

    promise.then(() => setRestockingSweet(null)).catch(() => {});
  };

  const clearFilters = () => {
    setSearchParams({});
    toast.success('Filters cleared');
  };

  const isMutating = addSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending || restockMutation.isPending;
  const isFiltered = Object.values(searchParams).some(value => value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true));

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {isAdmin ? 'Sweets Management' : 'Our Sweet Collection'}
            </h1>
            <p className="mt-1 text-md text-gray-600">
              {isAdmin ? 'Add, edit, and manage your sweet inventory.' : 'Browse our delicious, handcrafted sweets.'}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 w-full md:w-auto">
            {isFiltered && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
            {isAdmin && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setIsStatsDrawerOpen(true)}
                  className="flex items-center gap-2 flex-1"
                >
                  <TrendingUp className="h-4 w-4" />
                  Analytics
                </Button>
                <Button 
                  onClick={handleOpenAddForm}
                  className="flex-1"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Sweet
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SweetsToolbar onFilterChange={handleSearch} />
      </motion.div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading delicious sweets...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="mt-2 text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
          <p className="mt-1 text-red-600">We couldn't load the sweets. Please try again.</p>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && sweets && (
        <motion.div variants={itemVariants}>
          <SweetGrid
            sweets={sweets}
            onEdit={handleOpenEditForm}
            onDelete={handleOpenDeleteAlert}
            onRestock={handleOpenRestockDialog}
            isLoading={isMutating}
            isFiltered={isFiltered}
          />
        </motion.div>
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

      {isAdmin && (
        <RestockDialog
          isOpen={!!restockingSweet}
          onClose={() => setRestockingSweet(null)}
          onSubmit={handleRestockSubmit}
          sweet={restockingSweet}
          isSubmitting={restockMutation.isPending}
        />
      )}

      {isAdmin && (
        <StatsDrawer
          stats={stats}
          isMutating={isMutating}
          isOpen={isStatsDrawerOpen}
          onOpenChange={setIsStatsDrawerOpen}
        />
      )}

      <AlertDialog open={!!sweetToDelete} onOpenChange={(open) => !open && setSweetToDelete(null)}>
        <AlertDialogContent className="border-0 shadow-2xl animate-scale-in block">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Delete "{sweetToDelete?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently remove <strong>{sweetToDelete?.name}</strong> from your inventory.
              {sweetToDelete && sweetToDelete.quantity > 0 && (
                <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in">
                  <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    This sweet still has {sweetToDelete.quantity} units in stock
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:scale-105 transition-transform duration-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:scale-105 transition-all duration-200"
              disabled={deleteSweetMutation.isPending}
            >
              {deleteSweetMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : 'Delete Sweet'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default DashboardPage;