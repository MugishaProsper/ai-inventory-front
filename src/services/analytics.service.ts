import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

export interface DashboardAnalyticsResponse {
  summary: {
    totalProducts: number
    totalValue: number
    lowStockItems: number
    outOfStockItems: number
    totalCategories: number
    totalSuppliers: number
    monthlyRevenue: number
    monthlyRevenueChange: number
  }
  charts: {
    dailyRevenue: { date: string; value: number }[]
    categoryDistribution: { id: string; name: string; color: string; count: number; value: number; percentage: number }[]
    supplierDistribution: { id: string; name: string; color: string; count: number; value: number; percentage: number }[]
  }
  topSellingProducts: { id: string; name: string; sku: string; totalSold: number; revenue: number; image?: string | null }[]
  recentAlerts: { id: string; type: string; message: string; severity: string; createdAt: string }[]
  period: string
}

const AnalyticsService = {
  async dashboard(period: string = "30d"): Promise<ApiResponse<DashboardAnalyticsResponse>> {
    const response = await api.get("/analytics/dashboard", { params: { period } });
    return response.data;
  },
};

export default AnalyticsService;


