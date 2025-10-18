import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

export interface DashboardSummary {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  monthlyRevenue: number;
  monthlyRevenueChange: number;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface CategoryDistribution {
  id: string;
  name: string;
  color: string;
  count: number;
  value: number;
  percentage: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  sku: string;
  totalSold: number;
  revenue: number;
  image?: string;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface DashboardAnalytics {
  summary: DashboardSummary;
  charts: {
    dailyRevenue: ChartData[];
    categoryDistribution: CategoryDistribution[];
  };
  topSellingProducts: TopSellingProduct[];
  recentAlerts: Alert[];
  period: string;
}

export interface InventoryAnalytics {
  stockMovements: any[];
  inventoryTurnover: any[];
  stockStatusDistribution: any[];
  abcAnalysis: any[];
}

export interface SalesAnalytics {
  salesSummary: any;
  timeSeriesData: any[];
  topProductsByRevenue: any[];
  categoryPerformance: any[];
}

export interface SupplierPerformance {
  suppliers: any[];
  performanceMetrics: any;
  deliveryAnalysis: any;
}

const DashboardService = {
  // Get dashboard analytics
  async getDashboardAnalytics(period: string = '30d'): Promise<ApiResponse<DashboardAnalytics>> {
    const response = await api.get('/analytics/dashboard', {
      params: { period }
    });
    return response.data;
  },

  // Get inventory analytics
  async getInventoryAnalytics(period: string = '30d', categoryId?: string, supplierId?: string): Promise<ApiResponse<InventoryAnalytics>> {
    const response = await api.get('/analytics/inventory', {
      params: { period, categoryId, supplierId }
    });
    return response.data;
  },

  // Get sales analytics
  async getSalesAnalytics(period: string = '30d', groupBy: string = 'day'): Promise<ApiResponse<SalesAnalytics>> {
    const response = await api.get('/analytics/sales', {
      params: { period, groupBy }
    });
    return response.data;
  },

  // Get supplier performance analytics
  async getSupplierPerformance(period: string = '30d'): Promise<ApiResponse<SupplierPerformance>> {
    const response = await api.get('/analytics/suppliers', {
      params: { period }
    });
    return response.data;
  },

  // Get AI insights
  async getAIInsights(): Promise<ApiResponse<any>> {
    const response = await api.get('/ai/insights');
    return response.data;
  },

  // Get demand forecast
  async getDemandForecast(productIds: string[], period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await api.post('/ai/forecast', {
      productIds,
      period
    });
    return response.data;
  },

  // Get reorder suggestions
  async getReorderSuggestions(threshold: string = 'auto'): Promise<ApiResponse<any>> {
    const response = await api.post('/ai/reorder-suggestions', {
      threshold
    });
    return response.data;
  },

  // Detect anomalies
  async detectAnomalies(sensitivity: string = 'medium'): Promise<ApiResponse<any>> {
    const response = await api.post('/ai/anomalies', {
      sensitivity
    });
    return response.data;
  },

  // Get trends analysis
  async getTrends(): Promise<ApiResponse<any>> {
    const response = await api.get('/ai/trends');
    return response.data;
  }
};

export default DashboardService;
