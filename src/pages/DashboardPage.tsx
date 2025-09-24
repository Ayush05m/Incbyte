import React, { useState, useMemo, useCallback } from 'react';
import { useSweets, useUpdateSweetQuantity, useAddSweet, useUpdateSweet, useDeleteSweet } from '@/hooks/useSweets';
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
  X,
  Sparkles,
  Heart
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

  const handleSearch = useCallback((params: SearchParams) => setSearchParams(params), []);

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

  const isMutating = addSweetMutation.isPending || updateSweetMutation.isPending || deleteSweetMutation.isPending || updateQuantityMutation.isPending;
  const isFiltered = Object.keys(searchParams).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 animate-fade-in">
        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div className="text-center md:text-left transform animate-slide-in-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative p-3 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-2xl shadow-lg group">
                <Package className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-bounce" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent animate-gradient-x">
                  Sweet Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
                  <span className="text-pink-600 text-sm font-medium">Made with love</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-lg max-w-md">
              {isAdmin ? 'Manage your sweet inventory with style and track sales beautifully' : 'Discover and purchase the most delicious sweets in town'}
            </p>
            {user && (
              <div className="mt-3 animate-fade-in animation-delay-500">
                <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 border-pink-200 hover:shadow-md transition-shadow">
                  Welcome back, {user.username}! ✨
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 animate-slide-in-right">
            {isFiltered && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 border-pink-200 hover:bg-pink-50"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
            {isAdmin && (
              <Button 
                onClick={handleOpenAddForm}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <PlusCircle className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Sweet
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Cards - Admin Only */}
        {isAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                title: 'Total Sweets',
                value: stats.totalSweets,
                subtitle: `${stats.categories} categories`,
                icon: Package,
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Inventory Value',
                value: `$${stats.totalValue.toFixed(2)}`,
                subtitle: `Avg: $${stats.averagePrice.toFixed(2)}`,
                icon: DollarSign,
                color: 'green',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Low Stock',
                value: stats.lowStockItems,
                subtitle: 'Items below 10 units',
                icon: AlertTriangle,
                color: 'yellow',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Categories',
                value: stats.categories,
                subtitle: 'Unique varieties',
                icon: TrendingUp,
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Status',
                value: isMutating ? 'Updating...' : 'Active',
                subtitle: 'System status',
                icon: RefreshCcw,
                color: 'gray',
                gradient: 'from-gray-500 to-slate-500'
              }
            ].map((stat, index) => (
              <Card 
                key={stat.title}
                className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Search and Filter Section */}
        <Card className="mb-6 border-0 shadow-xl bg-white/95 backdrop-blur-sm animate-slide-in-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Search & Filter
              </CardTitle>
              {isFiltered && (
                <Badge variant="secondary" className="animate-pulse bg-indigo-100 text-indigo-700">
                  {Object.keys(searchParams).length} filter(s) applied
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <SweetsToolbar onFilterChange={handleSearch} />
          </CardContent>
        </Card>

        {/* Enhanced Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
              <LoadingSpinner />
              <div className="absolute inset-0 animate-ping">
                <div className="w-8 h-8 bg-pink-400 rounded-full opacity-20"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">Loading delicious sweets...</p>
            <div className="flex gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 200}ms` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Error State */}
        {error && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-pink-50 animate-shake">
            <CardContent className="text-center py-10">
              <div className="relative mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-200 rounded-full animate-ping opacity-20"></div>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-4">We couldn't load the sweets. Please try again.</p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50 hover:scale-105 transition-all duration-200"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Sweet Grid */}
        {!isLoading && !error && sweets && (
          <>
            {sweets.length === 0 ? (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-fade-in">
                <CardContent className="text-center py-16">
                  <div className="relative mb-6">
                    <Package className="h-20 w-20 text-gray-300 mx-auto" />
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-200 rounded-full animate-pulse opacity-30"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {isFiltered ? 'No sweets match your criteria' : 'No sweets available'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {isFiltered 
                      ? 'Try adjusting your filters to see more delicious results.' 
                      : 'The sweet collection is empty. Come back later for sweet surprises!'
                    }
                  </p>
                  {isFiltered && (
                    <Button 
                      onClick={clearFilters} 
                      variant="outline"
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {isFiltered ? 'Filtered Results' : 'All Sweets'}
                    </h2>
                    <Badge variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:scale-105 transition-transform duration-200">
                      {sweets.length} delicious item{sweets.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                <SweetGrid
                  sweets={sweets}
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

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={!!sweetToDelete} onOpenChange={(open) => !open && setSweetToDelete(null)}>
          <AlertDialogContent className="border-0 shadow-2xl animate-scale-in">
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
      </div>
    </div>
  );
};

export default DashboardPage;