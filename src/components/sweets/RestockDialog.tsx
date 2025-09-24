import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sweet } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { PackagePlus, ArrowRight } from 'lucide-react';

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
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
    defaultValues: { quantityToAdd: 10 },
  });

  const quantityToAdd = watch('quantityToAdd');

  useEffect(() => {
    if (!isOpen) {
      reset({ quantityToAdd: 10 });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: RestockFormData) => {
    onSubmit(data.quantityToAdd);
  };

  const handleQuickAdd = (amount: number) => {
    setValue('quantityToAdd', (quantityToAdd || 0) + amount, { shouldValidate: true });
  };

  if (!sweet) return null;

  const newTotal = sweet.quantity + (isNaN(quantityToAdd) ? 0 : quantityToAdd);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <PackagePlus className="h-6 w-6 text-primary" />
            Restock "{sweet.name}"
          </DialogTitle>
          <DialogDescription>
            Add more units to your inventory. The current stock is {sweet.quantity}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quantityToAdd" className="font-semibold">Quantity to Add</Label>
              <Input 
                id="quantityToAdd" 
                type="number" 
                {...register('quantityToAdd')} 
                placeholder="e.g., 50" 
                className="text-lg h-12"
              />
              {errors.quantityToAdd && <p className="text-red-500 text-sm mt-1">{errors.quantityToAdd.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Quick Add:</span>
              {[10, 25, 50, 100].map(amount => (
                <Button key={amount} type="button" variant="outline" size="sm" onClick={() => handleQuickAdd(amount)}>
                  +{amount}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-around p-4 bg-gray-50 rounded-lg border">
              <div className="text-center">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-2xl font-bold">{sweet.quantity}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-gray-300" />
              <div className="text-center">
                <p className="text-sm text-gray-500">New Total</p>
                <p className="text-2xl font-bold text-primary">{newTotal}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : `Add ${quantityToAdd || 0} Units`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};