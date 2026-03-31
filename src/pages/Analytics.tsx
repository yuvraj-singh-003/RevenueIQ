import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ComposedChart, Area
} from 'recharts';
import { Filter, Calendar, MapPin, Tag } from 'lucide-react';
import { useRevenueData, useFilteredData, FilterOptions } from '../hooks/useRevenueData';
import { ChartContainer } from '../components/ChartContainer';

export const Analytics: React.FC = () => {
  const { data, loading, error } = useRevenueData();
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    location: 'All',
    category: 'All'
  });

  const filteredData = useFilteredData(data, filters);

  const locations = useMemo(() => {
    const locs = Array.from(new Set(data.map(item => item.location))).sort();
    return ['All', ...locs];
  }, [data]);

  const analyticsData = useMemo(() => {
    if (!filteredData.length) return null;

    // Monthly breakdown
    const monthlyMap = filteredData.reduce((acc: any, item) => {
      const month = item.date.substring(0, 7);
      if (!acc[month]) acc[month] = { month, revenue: 0, profit: 0, customers: 0 };
      acc[month].revenue += item.revenue;
      acc[month].profit += item.profit;
      acc[month].customers += item.customerCount;
      return acc;
    }, {});

    const monthlyBreakdown = Object.values(monthlyMap).sort((a: any, b: any) => a.month.localeCompare(b.month));

    // Location performance
    const locationMap = filteredData.reduce((acc: any, item) => {
      if (!acc[item.location]) acc[item.location] = { location: item.location, revenue: 0, profit: 0 };
      acc[item.location].revenue += item.revenue;
      acc[item.location].profit += item.profit;
      return acc;
    }, {});

    const locationPerformance = Object.values(locationMap).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 10);

    return { monthlyBreakdown, locationPerformance };
  }, [filteredData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Advanced Analytics</h1>
          <p className="text-slate-500">Deep dive into your business performance data.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
            <div className="px-3 py-1.5 flex items-center gap-2 text-sm text-slate-600 border-r border-slate-100">
              <Calendar className="w-4 h-4" />
              <span>Range</span>
            </div>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="px-2 py-1 text-sm focus:outline-none"
            />
            <span className="text-slate-300">-</span>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="px-2 py-1 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <select 
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
            <Tag className="w-3 h-3" /> Category
          </label>
          <select 
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Footwear">Footwear</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={() => setFilters({ startDate: '2025-01-01', endDate: '2025-12-31', location: 'All', category: 'All' })}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {analyticsData ? (
        <div className="grid grid-cols-1 gap-6">
          <ChartContainer title="Revenue & Profit Growth Trends" height={400}>
            <ComposedChart data={analyticsData.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" fill="#6366f1" fillOpacity={0.1} stroke="#6366f1" strokeWidth={2} />
              <Bar dataKey="profit" barSize={20} fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="customers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ChartContainer>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Top 10 Locations by Revenue">
              <BarChart data={analyticsData.locationPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="location" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ChartContainer>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
              <h3 className="text-slate-900 font-semibold mb-4">Summary Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-indigo-900 font-medium text-sm">Top Performing Location</p>
                  <p className="text-indigo-600 text-2xl font-bold">
                    {analyticsData.locationPerformance[0]?.location}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-emerald-900 font-medium text-sm">Average Monthly Profit</p>
                  <p className="text-emerald-600 text-2xl font-bold">
                    ${(analyticsData.monthlyBreakdown.reduce((sum, m) => sum + m.profit, 0) / analyticsData.monthlyBreakdown.length).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-xl p-12 text-center text-slate-500">
          No data matches your current filters.
        </div>
      )}
    </div>
  );
};
