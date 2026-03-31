import React, { useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DollarSign, TrendingUp, Users, ShoppingBag, Percent, MapPin, Activity } from 'lucide-react';
import { useRevenueData } from '../hooks/useRevenueData';
import { Card } from '../components/Card';
import { ChartContainer } from '../components/ChartContainer';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC = () => {
  const { data, loading, error } = useRevenueData();

  const stats = useMemo(() => {
    if (!data.length) return null;

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
    const totalCustomers = data.length; // Each row is a transaction/customer in this mock
    const avgOrderValue = totalRevenue / totalCustomers;
    const profitMargin = (totalProfit / totalRevenue) * 100;

    // Group by month for time-series charts
    const monthlyDataMap = data.reduce((acc: any, item) => {
      const month = item.date.substring(0, 7);
      if (!acc[month]) acc[month] = { month, revenue: 0, expenses: 0, profit: 0, customers: 0 };
      acc[month].revenue += item.revenue;
      acc[month].expenses += item.expenses;
      acc[month].profit += item.profit;
      acc[month].customers += 1;
      return acc;
    }, {});

    const monthlyData = Object.values(monthlyDataMap).sort((a: any, b: any) => a.month.localeCompare(b.month));

    // Group by category for pie chart
    const categoryDataMap = data.reduce((acc: any, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category] += item.revenue;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

    // Group by product for top/bottom products chart
    const productDataMap = data.reduce((acc: any, item) => {
      if (!acc[item.itemPurchased]) acc[item.itemPurchased] = 0;
      acc[item.itemPurchased] += item.revenue;
      return acc;
    }, {});

    const productData = Object.entries(productDataMap)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);

    const topProducts = productData.slice(0, 5);
    const bottomProducts = [...productData].reverse().slice(0, 5);

    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalCustomers,
      avgOrderValue,
      profitMargin,
      monthlyData,
      categoryData,
      topProducts,
      bottomProducts,
      recentTransactions: data.slice(-5).reverse()
    };
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
      {error}
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
          <p className="text-slate-500">Real-time performance metrics for your business.</p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <Card 
          title="Total Expenses" 
          value={`$${stats.totalExpenses.toLocaleString()}`} 
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: 4.2, isPositive: false }}
        />
        <Card 
          title="Net Profit" 
          value={`$${stats.totalProfit.toLocaleString()}`} 
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={{ value: 18.3, isPositive: true }}
        />
        <Card 
          title="Active Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 8.1, isPositive: true }}
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card 
          title="Avg. Order Value" 
          value={`$${stats.avgOrderValue.toFixed(2)}`} 
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 3.4, isPositive: true }}
          className="bg-indigo-50/30 border-indigo-100"
        />
        <Card 
          title="Profit Margin" 
          value={`${stats.profitMargin.toFixed(1)}%`} 
          icon={<Percent className="w-5 h-5" />}
          trend={{ value: 1.2, isPositive: true }}
          className="bg-emerald-50/30 border-emerald-100"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Performance (Monthly)">
          <AreaChart data={stats.monthlyData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ChartContainer>

        <ChartContainer title="Profit vs Expenses Breakdown">
          <BarChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue by Category">
          <PieChart>
            <Pie
              data={stats.categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {stats.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ChartContainer>

        <ChartContainer title="Customer Growth">
          <LineChart data={stats.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Line type="stepAfter" dataKey="customers" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Product Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Top 5 Products by Revenue">
          <BarChart layout="vertical" data={stats.topProducts}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={100} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={15} />
          </BarChart>
        </ChartContainer>

        <ChartContainer title="Bottom 5 Products by Revenue">
          <BarChart layout="vertical" data={stats.bottomProducts}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={100} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={15} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-900 font-semibold">Recent Transactions</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {stats.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{tx.id}</td>
                  <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                  <td className="px-6 py-4 text-slate-600">{tx.itemPurchased}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {tx.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">${tx.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
