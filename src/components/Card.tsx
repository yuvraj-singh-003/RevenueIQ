import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border border-slate-100", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium mt-1",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-slate-400 ml-1 font-normal">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
