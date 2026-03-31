import { useState, useEffect, useMemo } from 'react';
import { mockTransactions, Transaction } from '../data/mockData';

export const useRevenueData = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setData(mockTransactions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch revenue data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export interface FilterOptions {
  startDate: string;
  endDate: string;
  location: string;
  category: string;
}

export const useFilteredData = (data: Transaction[], filters: FilterOptions) => {
  return useMemo(() => {
    return data.filter(item => {
      const dateMatch = (!filters.startDate || item.date >= filters.startDate) &&
                       (!filters.endDate || item.date <= filters.endDate);
      const locationMatch = !filters.location || filters.location === 'All' || item.location === filters.location;
      const categoryMatch = !filters.category || filters.category === 'All' || item.category === filters.category;
      
      return dateMatch && locationMatch && categoryMatch;
    });
  }, [data, filters]);
};
