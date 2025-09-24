import { apiClient } from './api';

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  fullAddress?: string;
  dateOfBirth?: string;
  customerType: 'individual' | 'business';
  companyName?: string;
  taxId?: string;
  status: 'active' | 'inactive' | 'suspended';
  preferredPaymentMethod?: string;
  creditLimit?: number;
  notes?: string;
  tags?: string[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  firstOrderDate?: string;
  lifetimeValue?: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CustomerFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  customerType?: 'individual' | 'business';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: string;
  customerType?: 'individual' | 'business';
  companyName?: string;
  taxId?: string;
  status?: 'active' | 'inactive' | 'suspended';
  preferredPaymentMethod?: string;
  creditLimit?: number;
  notes?: string;
  tags?: string[];
}

export interface CustomersResponse {
  success: boolean;
  data: {
    customers: Customer[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
    stats: {
      totalCustomers: number;
      activeCustomers: number;
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
    };
  };
}

class CustomersApi {
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomersResponse> {
    try {
      const response = await apiClient.get('/customers', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  }

  async getCustomerById(customerId: string): Promise<{ success: boolean; data: { customer: Customer; recentOrders: any[] } }> {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Get customer by ID error:', error);
      throw error;
    }
  }

  async createCustomer(customerData: CreateCustomerData): Promise<{ success: boolean; data: Customer; message: string }> {
    try {
      const response = await apiClient.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  async updateCustomer(customerId: string, customerData: Partial<CreateCustomerData>): Promise<{ success: boolean; data: Customer; message: string }> {
    try {
      const response = await apiClient.put(`/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  }

  async deleteCustomer(customerId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Delete customer error:', error);
      throw error;
    }
  }

  async syncCustomerStats(customerId: string): Promise<{ success: boolean; data: Customer; message: string }> {
    try {
      const response = await apiClient.post(`/customers/${customerId}/sync-stats`);
      return response.data;
    } catch (error) {
      console.error('Sync customer stats error:', error);
      throw error;
    }
  }

  async syncAllCustomerStats(): Promise<{ success: boolean; data: { customersUpdated: number }; message: string }> {
    try {
      const response = await apiClient.post('/customers/sync-all-stats');
      return response.data;
    } catch (error) {
      console.error('Sync all customer stats error:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(period: string = '30'): Promise<{ success: boolean; data: any }> {
    try {
      const response = await apiClient.get('/customers/analytics', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Get customer analytics error:', error);
      throw error;
    }
  }
}

export const customersApi = new CustomersApi();