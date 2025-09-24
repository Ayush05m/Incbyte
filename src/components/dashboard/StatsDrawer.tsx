import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { DashboardStats } from './DashboardStats';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Stats {
  totalSweets: number;
  totalValue: number;
  lowStockItems: number;
  categories: number;
  averagePrice: number;
}

interface StatsDrawerProps {
  stats: Stats | null;
  isMutating: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({ stats, isMutating, isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>Inventory Analytics</SheetTitle>
            <SheetDescription>A quick overview of your sweet shop's performance.</SheetDescription>
          </SheetHeader>
          <DashboardStats stats={stats} isMutating={isMutating} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};