import React, { useState, useMemo } from 'react';
import { useSweets, usePurchaseSweet, useUpdateSweetQuantity, useAddSweet, useUpdateSweet, useDeleteSweet } from '@/hooks/useSweets';
import { SweetGrid } from '@/components/sweets/SweetGrid';
import { SweetsToolbar } from '@/components/sweets/SweetsToolbar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SearchParams, Sweet, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  TrendingUp, 
  Package, 
  DollarSign, 
  AlertTriangle,
  RefreshCcw,
  Filter,
  X
} from 'lucide-react';
import { SweetFormDialog } from '@/components/sweets/SweetFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: sweets, isLoading, error, refetch } = useSweets(searchParams);
  const purchaseMutation = usePurchaseSweet();
  const updateQuantityMutation = useUpdateSweetQuantity(searchParams);
  const addSweetMutation = useAddSweet();
  const updateSweetMutation = useUpdateSweet();
  const deleteSweetMutation = useDeleteSweet();

  // Statistics calculations
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
    toast.promise(updateQuantityMutation.mutateAsync({ sweetId, newQuantity }), {
      loading: 'Updating quantity...',
      success: 'Quantity updated successfully!',
      error: (err: any) => err?.response?.data?.message || 'Failed to update quantity.',
    });
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
    const action = editingSweet
      ? updateSweetMutation.mutateAsync({ sweetId: editingSweet.id, sweetData: data })
      : addSweetMutation.mutateAsync(data as CreateSweetDto);

    toast.promise(action, {
      loading: editingSweet ? 'Updating sweet...' : 'Adding sweet...',
      success: `Sweet ${editingSweet ? 'updated' : 'added'} successfully!`,
      error: (err: any) => err?.response?.data?.message || `Failed to ${editingSweet ? 'update' : 'add'} sweet.`,
    });

    action.then(() => setIsFormOpen(false)).catch(() => {});
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

  const clearFilters = () => {
    setSearchParams({});
    toast.success('Filters cleared');
  };

  const isMutating = purchaseMutation.isPending || addSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending || updateQuantityMutation.isPending;
  const isFiltered = Object.keys(searchParams).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                Sweet Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              {isAdmin ? 'Manage your sweet inventory and track sales' : 'Discover and purchase delicious sweets'}
            </p>
            {user && (
              <Badge variant="secondary" className="mt-2">
                Welcome back, {user.username}!
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {isFiltered && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            {isAdmin && (
              <Button 
                onClick={handleOpenAddForm}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 shadow-lg"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Sweet
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards - Admin Only */}
        {isAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sweets</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.totalSweets}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.categories} categories
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.totalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${stats.averagePrice.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">
                  Items below 10 units
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
                <p className="text-xs text-muted-foreground">
                  Unique varieties
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <RefreshCcw className={`h-4 w-4 ${isMutating ? 'animate-spin text-blue-600' : 'text-gray-600'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {isMutating ? 'Updating...' : 'Active'}
                </div>
                <p className="text-xs text-muted-foreground">
                  System status
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter Section */}
        <Card className="mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Search & Filter</CardTitle>
              {isFiltered && (
                <Badge variant="secondary">
                  {Object.keys(searchParams).length} filter(s) applied
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <SweetsToolbar onFilterChange={handleSearch} />
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading delicious sweets...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-0 shadow-lg bg-red-50">
            <CardContent className="text-center py-10">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-4">We couldn't load the sweets. Please try again.</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Sweet Grid */}
        {!isLoading && !error && sweets && (
          <>
            {sweets.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {isFiltered ? 'No sweets match your criteria' : 'No sweets available'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {isFiltered 
                      ? 'Try adjusting your filters to see more results.' 
                      : 'The sweet collection is empty. Come back later or contact us.'
                    }
                  </p>
                  {isFiltered && (
                    <Button onClick={clearFilters} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {isFiltered ? 'Filtered Results' : 'All Sweets'}
                    </h2>
                    <Badge variant="secondary">
                      {sweets.length} item{sweets.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                <SweetGrid
                  sweets={sweets}
                  onPurchase={handlePurchase}
                  onUpdateQuantity={handleUpdateQuantity}
                  onEdit={handleOpenEditForm}
                  onDelete={handleOpenDeleteAlert}
                  isLoading={isMutating}
                  isFiltered={isFiltered}
                />
              </div>
            )}
          </>
        )}

        {/* Sweet Form Dialog */}
        {isAdmin && (
          <SweetFormDialog
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
            sweet={editingSweet}
            isSubmitting={addSweetMutation.isPending || updateSweetMutation.isPending}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!sweetToDelete} onOpenChange={(open) => !open && setSweetToDelete(null)}>
          <AlertDialogContent className="border-0 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Delete "{sweetToDelete?.name}"?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently remove <strong>{sweetToDelete?.name}</strong> from your inventory.
                {sweetToDelete && sweetToDelete.quantity > 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ This sweet still has {sweetToDelete.quantity} units in stock
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                disabled={deleteSweetMutation.isPending}
              >
                {deleteSweetMutation.isPending ? 'Deleting...' : 'Delete Sweet'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DashboardPage;