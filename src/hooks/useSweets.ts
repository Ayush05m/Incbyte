import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sweetsService } from '@/services/sweets.service';
import { CreateSweetDto, SearchParams, UpdateSweetDto } from '@/types/sweet.types';

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
    mutationFn: (sweetData: CreateSweetDto) => sweetsService.addSweet(sweetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useUpdateSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sweetId, sweetData }: { sweetId: string; sweetData: UpdateSweetDto }) =>
      sweetsService.updateSweet(sweetId, sweetData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useDeleteSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sweetId: string) => sweetsService.deleteSweet(sweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const usePurchaseSweet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sweetId, quantity }: { sweetId: string; quantity: number }) =>
      sweetsService.purchaseSweet(sweetId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};

export const useUpdateSweetQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sweetId, newQuantity }: { sweetId: string; newQuantity: number }) =>
      sweetsService.updateSweetQuantity(sweetId, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
    },
  });
};