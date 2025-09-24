import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sweet, CreateSweetDto, UpdateSweetDto } from '@/types/sweet.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, X, Link2, Package, IndianRupee } from 'lucide-react';

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

const categories = ['Cakes', 'Pastries', 'Candies', 'Frozen'] as const;

const useSweetForm = (sweet: Sweet | null, isOpen: boolean) => {
  const defaultValues: SweetFormData = {
    name: '',
    category: '',
    price: 1,
    quantity: 0,
    description: null,
    imageUrl: null,
  };

  const form = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset(sweet || defaultValues);
    }
  }, [sweet, isOpen, form]);

  return form;
};

const ImageUploadSection: React.FC<{
  imageUrl: string | null;
  setValue: (name: 'imageUrl', value: string | null, options?: { shouldValidate: boolean }) => void;
  register: any;
  errors: any;
}> = ({ imageUrl, setValue, register, errors }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('imageUrl', URL.createObjectURL(file), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="font-semibold">Sweet Image</Label>
      {imageUrl ? (
        <div className="relative group aspect-square">
          <img src={imageUrl} alt="Sweet preview" className="rounded-lg object-cover w-full h-full border shadow-sm" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setValue('imageUrl', null, { shouldValidate: true })}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor="imageUpload"
          className="relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
          </div>
          <Input
            id="imageUpload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Upload sweet image"
          />
        </label>
      )}
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          id="imageUrl"
          placeholder="Or paste an image URL"
          {...register('imageUrl')}
          className="pl-9"
          aria-invalid={!!errors.imageUrl}
        />
      </div>
      {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
    </div>
  );
};

const FormFieldsSection: React.FC<{
  control: any;
  register: any;
  errors: any;
}> = ({ control, register, errors }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="name" className="font-semibold">Name</Label>
      <Input id="name" {...register('name')} placeholder="e.g., Chocolate Fudge Cake" aria-invalid={!!errors.name} />
      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
    </div>

    <div>
      <Label htmlFor="category" className="font-semibold">Category</Label>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value} aria-label="Select sweet category">
            <SelectTrigger>
              <SelectValue placeholder="Select a category..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price" className="font-semibold">Price (₹)</Label>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="price"
            type="number"
            step="1"
            {...register('price')}
            placeholder="25"
            className="pl-9"
            aria-invalid={!!errors.price}
          />
        </div>
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>
      <div>
        <Label htmlFor="quantity" className="font-semibold">Quantity</Label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="quantity"
            type="number"
            {...register('quantity')}
            placeholder="100"
            className="pl-9"
            aria-invalid={!!errors.quantity}
          />
        </div>
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
      </div>
    </div>

    <div>
      <Label htmlFor="description" className="font-semibold">Description</Label>
      <Textarea
        id="description"
        {...register('description')}
        placeholder="Describe the sweet in a few words..."
        rows={4}
        aria-invalid={!!errors.description}
      />
      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
    </div>
  </div>
);

export const SweetFormDialog: React.FC<SweetFormDialogProps> = ({ isOpen, onClose, onSubmit, sweet, isSubmitting }) => {
  const { control, register, handleSubmit, formState: { errors }, watch, setValue } = useSweetForm(sweet, isOpen);
  const imageUrl = watch('imageUrl');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl block">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{sweet ? 'Edit Sweet Details' : 'Create a New Sweet'}</DialogTitle>
          <DialogDescription>
            {sweet ? 'Update the information for your sweet.' : 'Fill out the form to add a new sweet to your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto px-1 pr-4">
            <ImageUploadSection imageUrl={imageUrl} setValue={setValue} register={register} errors={errors} />
            <FormFieldsSection control={control} register={register} errors={errors} />
          </div>
          <DialogFooter className="pt-4 border-t mt-2">
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