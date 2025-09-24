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
  quantityToAdd: z.coerce.number().int().min(1, 'Must add at least 1 unit'),
});

type RestockFormData = z.infer<typeof restockSchema>;

interface RestockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quantityToAdd: number) => void;
  sweet: Sweet | null;
  isSubmitting?: boolean;
}

export const RestockDialog: React.FC<RestockDialogProps> = ({ isOpen, onClose, onSubmit, sweet, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({ quantityToAdd: 1 });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: RestockFormData) => {
    onSubmit(data.quantityToAdd);
  };

  if (!sweet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Stock to "{sweet.name}"</DialogTitle>
          <DialogDescription>
            Current stock is {sweet.quantity}. Enter the number of units you want to add.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="py-4">
            <div>
              <Label htmlFor="quantityToAdd">Quantity to Add</Label>
              <Input id="quantityToAdd" type="number" {...register('quantityToAdd')} placeholder="e.g., 50" />
              {errors.quantityToAdd && <p className="text-red-500 text-sm mt-1">{errors.quantityToAdd.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};