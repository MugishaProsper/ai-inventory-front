import api from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";

export interface AIInsightItem {
  id: string
  type: string
  title: string
  description?: string
  confidence: number
  priority?: string
  actionable?: boolean
  createdAt?: string
  data?: Record<string, any>
}

type BackendInsight = any;

function mapBackendInsight(i: BackendInsight): AIInsightItem {
  return {
    id: i._id ?? i.id,
    type: i.type,
    title: i.title,
    description: i.description,
    confidence: i.confidence ?? 0,
    priority: i.priority,
    actionable: i.actionable,
    createdAt: i.createdAt,
    data: i.data,
  };
}

const AIService = {
  async list(params: { type?: string; priority?: string; status?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<AIInsightItem>> {
    const response = await api.get("/ai/insights", { params });
    const data = response.data;
    const items: AIInsightItem[] = Array.isArray(data.data) ? data.data.map(mapBackendInsight) : [];
    return {
      success: !!data.success,
      message: data.message ?? "",
      data: items,
      pagination: {
        page: data.pagination?.page ?? 1,
        limit: data.pagination?.limit ?? items.length,
        total: data.pagination?.total ?? items.length,
        totalPages: data.pagination?.totalPages ?? 1,
        hasNextPage: Boolean(data.pagination && data.pagination.page < data.pagination.totalPages),
        hasPrevPage: Boolean(data.pagination && data.pagination.page > 1),
      },
    };
  },
  async summary(): Promise<ApiResponse<any>> {
    const response = await api.get("/ai/insights/summary");
    return response.data;
  },
};

export default AIService;


