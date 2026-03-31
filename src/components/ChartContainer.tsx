import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title: string;
  children: React.ReactElement;
  height?: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, height = 300 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-slate-900 font-semibold mb-6">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
