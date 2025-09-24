import { apiClient } from './api';

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  supplier?: string;
  status?: string;
  format?: 'json' | 'csv' | 'pdf';
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  categories: Array<{
    categoryName: string;
    productCount: number;
    totalValue: number;
  }>;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  topCustomers: Array<{
    customerName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface SupplierReport {
  totalSuppliers: number;
  activeSuppliers: number;
  topSuppliers: Array<{
    supplierName: string;
    totalProducts: number;
    totalValue: number;
  }>;
}

class ReportsApi {
  async getSalesReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: SalesReport }> {
    try {
      // Use dashboard sales analytics and overview for top products
      const periodDays = filters.startDate && filters.endDate
        ? Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 30;

      const [salesResponse, overviewResponse] = await Promise.all([
        apiClient.get(`/dashboard/sales?period=${periodDays}`),
        apiClient.get('/dashboard/overview')
      ]);

      if (salesResponse.data.success) {
        const salesData = salesResponse.data.data;
        const overviewData = overviewResponse.data.success ? overviewResponse.data.data : {};
        const summary = salesData.summary || {};

        // Get top products from overview data
        const topProducts = (overviewData.topProducts || []).map((product: any) => ({
          productId: product._id,
          productName: product.name || 'Unknown Product',
          quantitySold: product.totalQuantity || 0,
          revenue: product.totalRevenue || 0
        }));

        return {
          success: true,
          data: {
            period: `${periodDays} days`,
            totalSales: summary.totalRevenue || 0,
            totalOrders: summary.totalOrders || 0,
            averageOrderValue: summary.avgValue || 0,
            topProducts: topProducts
          }
        };
      }

      return {
        success: true,
        data: {
          period: `${periodDays} days`,
          totalSales: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          topProducts: []
        }
      };
    } catch (error) {
      console.error('Sales report error:', error);
      throw error;
    }
  }

  async getInventoryReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: InventoryReport }> {
    try {
      // Use dashboard overview and inventory analytics
      const [overviewResponse, inventoryResponse] = await Promise.all([
        apiClient.get('/dashboard/overview'),
        apiClient.get('/dashboard/inventory')
      ]);

      if (overviewResponse.data.success && inventoryResponse.data.success) {
        const overview = overviewResponse.data.data;
        const inventory = inventoryResponse.data.data;

        return {
          success: true,
          data: {
            totalProducts: overview.counts?.products || 0,
            totalValue: overview.inventory?.totalValue || 0,
            lowStockItems: overview.inventory?.lowStockCount || 0,
            outOfStockItems: 0, // Would need to calculate from stock levels
            categories: inventory.productsByCategory?.map((cat: any) => ({
              categoryName: cat._id || 'Uncategorized',
              productCount: cat.count || 0,
              totalValue: cat.totalValue || 0
            })) || []
          }
        };
      }

      return {
        success: true,
        data: {
          totalProducts: 0,
          totalValue: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          categories: []
        }
      };
    } catch (error) {
      console.error('Inventory report error:', error);
      throw error;
    }
  }

  async getCustomerReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: CustomerReport }> {
    try {
      // Use dashboard sales analytics to get customer data
      const periodDays = filters.startDate && filters.endDate
        ? Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 30;

      const response = await apiClient.get(`/dashboard/sales?period=${periodDays}`);

      if (response.data.success) {
        const salesData = response.data.data;
        const topCustomers = salesData.topCustomers || [];

        // Calculate customer metrics from available data
        const totalCustomers = topCustomers.length;
        const newCustomers = 0; // Will be calculated from actual customer data
        const repeatCustomers = totalCustomers;

        return {
          success: true,
          data: {
            totalCustomers,
            newCustomers,
            repeatCustomers,
            topCustomers: topCustomers.map((customer: any) => ({
              customerName: customer.customerName || customer._id || 'Unknown Customer',
              totalOrders: customer.orderCount || 0,
              totalSpent: customer.totalSpent || 0
            }))
          }
        };
      }

      // Return empty data if no sales data available
      return {
        success: true,
        data: {
          totalCustomers: 0,
          newCustomers: 0,
          repeatCustomers: 0,
          topCustomers: []
        }
      };
    } catch (error) {
      console.error('Customer report error:', error);
      throw error;
    }
  }

  async getSupplierReport(filters: ReportFilters = {}): Promise<{ success: boolean; data: SupplierReport }> {
    try {
      // Use dashboard overview to get supplier data
      const response = await apiClient.get('/dashboard/overview');

      if (response.data.success) {
        const overviewData = response.data.data;
        const supplierCount = overviewData.counts?.suppliers || 0;

        // Return actual supplier data only
        return {
          success: true,
          data: {
            totalSuppliers: supplierCount,
            activeSuppliers: 0, // Will be calculated from actual supplier status
            topSuppliers: [] // Will be populated from actual supplier data
          }
        };
      }

      // Fallback to empty data
      return {
        success: true,
        data: {
          totalSuppliers: 0,
          activeSuppliers: 0,
          topSuppliers: []
        }
      };
    } catch (error) {
      console.error('Supplier report error:', error);
      throw error;
    }
  }

  async exportReport(type: string, filters: ReportFilters = {}): Promise<Blob> {
    try {
      // For now, create a simple CSV export from the report data
      let reportData;

      switch (type) {
        case 'sales':
          reportData = await this.getSalesReport(filters);
          break;
        case 'inventory':
          reportData = await this.getInventoryReport(filters);
          break;
        case 'customers':
          reportData = await this.getCustomerReport(filters);
          break;
        case 'suppliers':
          reportData = await this.getSupplierReport(filters);
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Convert to CSV format
      let csvContent = '';

      if (type === 'sales') {
        const salesData = reportData.data as SalesReport;
        csvContent = `Sales Report\n`;
        csvContent += `Period,${salesData.period}\n`;
        csvContent += `Total Sales,$${salesData.totalSales}\n`;
        csvContent += `Total Orders,${salesData.totalOrders}\n`;
        csvContent += `Average Order Value,$${salesData.averageOrderValue}\n`;
      } else if (type === 'inventory') {
        const inventoryData = reportData.data as InventoryReport;
        csvContent = `Inventory Report\n`;
        csvContent += `Total Products,${inventoryData.totalProducts}\n`;
        csvContent += `Total Value,$${inventoryData.totalValue}\n`;
        csvContent += `Low Stock Items,${inventoryData.lowStockItems}\n`;
        csvContent += `Out of Stock Items,${inventoryData.outOfStockItems}\n`;
        csvContent += `\nCategories\n`;
        csvContent += `Category,Product Count,Total Value\n`;
        inventoryData.categories.forEach((cat: any) => {
          csvContent += `${cat.categoryName},${cat.productCount},$${cat.totalValue}\n`;
        });
      } else if (type === 'customers') {
        const customerData = reportData.data as CustomerReport;
        csvContent = `Customer Report\n`;
        csvContent += `Total Customers,${customerData.totalCustomers}\n`;
        csvContent += `New Customers,${customerData.newCustomers}\n`;
        csvContent += `Repeat Customers,${customerData.repeatCustomers}\n`;
        csvContent += `\nTop Customers\n`;
        csvContent += `Customer Name,Total Orders,Total Spent\n`;
        customerData.topCustomers.forEach((customer: any) => {
          csvContent += `${customer.customerName},${customer.totalOrders},$${customer.totalSpent}\n`;
        });
      } else if (type === 'suppliers') {
        const supplierData = reportData.data as SupplierReport;
        csvContent = `Supplier Report\n`;
        csvContent += `Total Suppliers,${supplierData.totalSuppliers}\n`;
        csvContent += `Active Suppliers,${supplierData.activeSuppliers}\n`;
        csvContent += `\nTop Suppliers\n`;
        csvContent += `Supplier Name,Total Products,Total Value\n`;
        supplierData.topSuppliers.forEach((supplier: any) => {
          csvContent += `${supplier.supplierName},${supplier.totalProducts},$${supplier.totalValue}\n`;
        });
      }

      // Create blob
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      console.error('Export report error:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(period: string = '12months'): Promise<{ success: boolean; data: any }> {
    try {
      // Use dashboard sales analytics endpoint
      const periodDays = this.convertPeriodToDays(period);
      const response = await apiClient.get(`/dashboard/sales?period=${periodDays}`);

      if (response.data.success) {
        // Transform the data to match expected format
        const salesData = response.data.data;
        return {
          success: true,
          data: {
            summary: salesData.summary,
            salesOverTime: salesData.salesOverTime,
            salesByStatus: salesData.salesByStatus,
            topCustomers: salesData.topCustomers,
            topRevenueSources: salesData.topCustomers?.map((customer: any) => ({
              name: customer.customerName || customer._id,
              revenue: customer.totalSpent
            })) || []
          }
        };
      }
      return response.data;
    } catch (error) {
      console.error('Revenue analytics error:', error);
      throw error;
    }
  }

  async getGrowthAnalytics(period: string = '12months'): Promise<{ success: boolean; data: any }> {
    try {
      // Use dashboard overview and sales analytics
      const periodDays = this.convertPeriodToDays(period);
      const [overviewResponse, salesResponse] = await Promise.all([
        apiClient.get('/dashboard/overview'),
        apiClient.get(`/dashboard/sales?period=${periodDays}`)
      ]);

      if (overviewResponse.data.success && salesResponse.data.success) {
        const overview = overviewResponse.data.data;
        const sales = salesResponse.data.data;

        // Calculate growth metrics from available data
        const currentRevenue = sales.summary?.totalRevenue || 0;
        const currentOrders = sales.summary?.totalOrders || 0;
        const currentProducts = overview.counts?.products || 0;

        // Previous period data would come from historical data
        const previousRevenue = 0; // No historical data available
        const previousOrders = 0; // No historical data available
        const previousProducts = 0; // No historical data available

        return {
          success: true,
          data: {
            revenueGrowth: {
              current: currentRevenue,
              rate: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0
            },
            orderGrowth: {
              current: currentOrders,
              rate: previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0
            },
            productGrowth: {
              current: currentProducts,
              rate: previousProducts > 0 ? ((currentProducts - previousProducts) / previousProducts) * 100 : 0
            },
            customerGrowth: {
              current: sales.topCustomers?.length || 0,
              rate: 0 // No historical data for growth calculation
            },
            monthlyActiveCustomers: {
              current: sales.topCustomers?.length || 0,
              previous: 0
            },
            averageOrderValue: {
              current: sales.summary?.avgValue || 0,
              previous: 0
            },
            customerRetention: {
              current: 0,
              previous: 0
            },
            conversionRate: {
              current: 0,
              previous: 0
            },
            insights: [],
            opportunities: []
          }
        };
      }

      return {
        success: false,
        data: null
      };
    } catch (error) {
      console.error('Growth analytics error:', error);
      throw error;
    }
  }

  private convertPeriodToDays(period: string): string {
    switch (period) {
      case '30days': return '30';
      case '90days': return '90';
      case '6months': return '180';
      case '12months': return '365';
      case '2years': return '730';
      default: return '365';
    }
  }
}

export const reportsApi = new ReportsApi();