import { useState, useEffect } from 'react';
import { customersApi, Customer, CustomerFilters, CreateCustomerData } from '../services/customersApi';

export const useCustomers = (initialFilters: CustomerFilters = {}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>(initialFilters);

  const fetchCustomers = async (newFilters?: CustomerFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersToUse = newFilters || filters;
      const response = await customersApi.getCustomers(filtersToUse);
      
      if (response.success) {
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
        setStats(response.data.stats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerById = async (customerId: string): Promise<{ customer: Customer; recentOrders: any[] } | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.getCustomerById(customerId);
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer');
      console.error('Failed to fetch customer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: CreateCustomerData): Promise<Customer | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.createCustomer(customerData);
      
      if (response.success) {
        // Refresh the customer list
        await fetchCustomers();
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create customer');
      console.error('Failed to create customer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (customerId: string, customerData: Partial<CreateCustomerData>): Promise<Customer | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.updateCustomer(customerId, customerData);
      
      if (response.success) {
        // Refresh the customer list
        await fetchCustomers();
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update customer');
      console.error('Failed to update customer:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (customerId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.deleteCustomer(customerId);
      
      if (response.success) {
        // Refresh the customer list
        await fetchCustomers();
        return true;
      }
      
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete customer');
      console.error('Failed to delete customer:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncCustomerStats = async (customerId: string): Promise<Customer | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.syncCustomerStats(customerId);
      
      if (response.success) {
        // Refresh the customer list
        await fetchCustomers();
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync customer stats');
      console.error('Failed to sync customer stats:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const syncAllCustomerStats = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customersApi.syncAllCustomerStats();
      
      if (response.success) {
        // Refresh the customer list
        await fetchCustomers();
        return true;
      }
      
      return false;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync all customer stats');
      console.error('Failed to sync all customer stats:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const refreshCustomers = () => {
    fetchCustomers();
  };

  // Initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    pagination,
    stats,
    loading,
    error,
    filters,
    fetchCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    syncCustomerStats,
    syncAllCustomerStats,
    updateFilters,
    refreshCustomers
  };
};