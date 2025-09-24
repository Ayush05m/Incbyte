import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sweet, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';

const sweetSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0.01, 'Price must be positive'),
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
        reset({ name: '', category: '', price: 0, quantity: 0, description: null, imageUrl: null });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1 pr-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} />
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
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register('quantity')} />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label>Image</Label>
              <Tabs defaultValue="url" className="w-full mt-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="pt-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.png"
                    {...register('imageUrl')}
                  />
                </TabsContent>
                <TabsContent value="upload" className="pt-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </TabsContent>
              </Tabs>
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
              {imageUrl && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Image Preview:</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setValue('imageUrl', null, { shouldValidate: true })}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <img src={imageUrl} alt="Preview" className="rounded-md object-cover h-32 w-full border" />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};