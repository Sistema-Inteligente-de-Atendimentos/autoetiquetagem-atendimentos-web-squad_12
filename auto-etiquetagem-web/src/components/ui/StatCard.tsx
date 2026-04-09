import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
}

export const StatCard = ({ title, value, trend, trendType, icon: Icon, iconColor }: StatCardProps) => {
  const trendColor = trendType === 'positive' ? 'text-green-500' : trendType === 'negative' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
          <Icon size={20} className={iconColor.replace('bg-', 'text-')} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-xs font-semibold mt-1 ${trendColor}`}>
          {trend} <span className="text-gray-400 font-normal">vs mês anterior</span>
        </span>
      </div>
    </div>
  );
};