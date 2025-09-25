import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsService } from '@/services/sweets.service';
import { CreateSweetDto, SearchParams, Sweet, UpdateSweetDto } from '@/types/sweet.types';
import { toast } from 'sonner';

export const useSweets = (searchParams?: SearchParams) => {
  return useQuery({
    queryKey: ['sweets', searchParams],
    queryFn: () => sweetsService.getSweets(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sweetData: CreateSweetDto | FormData) => sweetsService.addSweet(sweetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useUpdateSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sweetId, sweetData }: { sweetId: number; sweetData: UpdateSweetDto | FormData }) =>
      sweetsService.updateSweet(sweetId, sweetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useDeleteSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sweetId: number) => sweetsService.deleteSweet(sweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useRestockSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sweetId, quantity }: { sweetId: number; quantity: number }) =>
      sweetsService.restockSweet(sweetId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useUpdateSweetQuantity = (searchParams?: SearchParams) => {
  const queryClient = useQueryClient();
  const queryKey = ['sweets', searchParams];

  return useMutation({
    mutationFn: ({ sweetId, newQuantity }: { sweetId: number; newQuantity: number }) =>
      sweetsService.updateSweetQuantity(sweetId, newQuantity),
    
    onMutate: async ({ sweetId, newQuantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousSweets = queryClient.getQueryData<Sweet[]>(queryKey);
      
      queryClient.setQueryData<Sweet[]>(queryKey, (old) =>
        old?.map(sweet => 
          sweet.id === sweetId ? { ...sweet, quantity: newQuantity } : sweet
        ) ?? []
      );
      
      return { previousSweets };
    },
    
    onError: (err, variables, context) => {
      if (context?.previousSweets) {
        queryClient.setQueryData(queryKey, context.previousSweets);
      }
      toast.error('Failed to update quantity. Restoring previous state.');
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};