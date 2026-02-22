// SERVER COMPONENT — pure display, no interactivity
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string;
  change: number;         // percentage, positive = up
  trend: 'up' | 'down';
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
}

export default function StatCard({
  label, value, change, trend,
  icon: Icon, iconColor = 'text-amber-700', iconBg = 'bg-amber-100',
  prefix,
}: Props) {
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-md hover:shadow-slate-100 transition-shadow">
      <div className="flex items-start justify-between">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
        {/* Trend badge */}
        <span className={cn(
          'inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full',
          isUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
        )}>
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </span>
      </div>

      <div>
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {prefix}{value}
        </p>
        <p className="text-sm text-slate-500 font-medium mt-0.5">{label}</p>
        <p className={cn('text-xs font-semibold mt-1', isUp ? 'text-green-600' : 'text-red-500')}>
          {isUp ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </p>
      </div>
    </div>
  );
}