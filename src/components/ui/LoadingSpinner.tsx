import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={cn('h-8 w-8 animate-spin text-primary-600', className)} />
    </div>
  );
};