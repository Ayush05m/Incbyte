import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  DollarSign, 
  AlertTriangle,
  TrendingUp, 
  RefreshCcw
} from 'lucide-react';

interface Stats {
  totalSweets: number;
  totalValue: number;
  lowStockItems: number;
  categories: number;
  averagePrice: number;
}

interface DashboardStatsProps {
  stats: Stats | null;
  isMutating: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isMutating }) => {
  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>No data available to generate analytics.</p>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Sweets',
      value: stats.totalSweets,
      subtitle: `${stats.categories} categories`,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Inventory Value',
      value: `₹${stats.totalValue.toLocaleString('en-IN')}`,
      subtitle: `Avg: ₹${stats.averagePrice.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Low Stock',
      value: stats.lowStockItems,
      subtitle: 'Items below 10 units',
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Categories',
      value: stats.categories,
      subtitle: 'Unique varieties',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Status',
      value: isMutating ? 'Updating...' : 'Active',
      subtitle: 'System status',
      icon: RefreshCcw,
      gradient: 'from-gray-500 to-slate-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {statItems.map((stat, index) => (
        <Card 
          key={stat.title}
          className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};