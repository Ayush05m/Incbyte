import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sweet, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, X, Link2 } from 'lucide-react';

const sweetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().int().min(1, 'Price must be at least ₹1'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters').nullable(),
  imageUrl: z.string().url('Must be a valid URL').or(z.string().startsWith('blob:')).nullable(),
});

type SweetFormData = z.infer<typeof sweetSchema>;

interface SweetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSweetDto | UpdateSweetDto) => void;
  sweet?: Sweet | null;
  isSubmitting?: boolean;
}

export const SweetFormDialog: React.FC<SweetFormDialogProps> = ({ isOpen, onClose, onSubmit, sweet, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors }, control, reset, setValue, watch } = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
  });

  const imageUrl = watch('imageUrl');

  React.useEffect(() => {
    if (isOpen) {
      if (sweet) {
        reset(sweet);
      } else {
        reset({ name: '', category: '', price: 1, quantity: 0, description: null, imageUrl: null });
      }
    }
  }, [sweet, isOpen, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setValue('imageUrl', newImageUrl, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: SweetFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {sweet ? 'update the' : 'add a new'} sweet to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-2 pr-4">
            
            {/* Image Section */}
            <div className="space-y-2">
              <Label>Image</Label>
              {imageUrl ? (
                <div className="relative group">
                  <img src={imageUrl} alt="Preview" className="rounded-lg object-cover h-40 w-full border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setValue('imageUrl', null, { shouldValidate: true })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="imageUpload"
                  className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                  </div>
                  <Input id="imageUpload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="imageUrl"
                  placeholder="Or paste an image URL"
                  {...register('imageUrl')}
                  className="pl-9"
                />
              </div>
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
            </div>

            {/* Other Fields */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g., Chocolate Fudge Cake" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cakes">Cakes</SelectItem>
                        <SelectItem value="Pastries">Pastries</SelectItem>
                        <SelectItem value="Candies">Candies</SelectItem>
                        <SelectItem value="Frozen">Frozen</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" step="1" {...register('price')} placeholder="e.g., 25" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} placeholder="e.g., 100" />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Describe the sweet..." />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};