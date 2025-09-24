import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const restockSchema = z.object({
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
});

type RestockFormData = z.infer<typeof restockSchema>;

interface RestockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newQuantity: number) => void;
  sweet: Sweet | null;
  isSubmitting?: boolean;
}

export const RestockDialog: React.FC<RestockDialogProps> = ({ isOpen, onClose, onSubmit, sweet, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
  });

  React.useEffect(() => {
    if (sweet) {
      reset({ quantity: sweet.quantity });
    }
  }, [sweet, reset]);

  const handleFormSubmit = (data: RestockFormData) => {
    onSubmit(data.quantity);
  };

  if (!sweet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restock "{sweet.name}"</DialogTitle>
          <DialogDescription>
            Current stock is {sweet.quantity}. Set the new total quantity for this item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="py-4">
            <div>
              <Label htmlFor="quantity">New Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Quantity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};