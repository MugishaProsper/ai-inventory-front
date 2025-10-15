import api from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { Category } from "@/types";

type BackendCategory = any;

function mapBackendCategory(c: BackendCategory): Category {
    return {
        id: c._id ?? c.id,
        name: c.name,
        description: c.description,
        color: c.color ?? "bg-gray-500",
        productCount: c.metadata?.productCount ?? c.productCount ?? 0,
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    } as Category;
}

export interface CategoryListParams {
    page?: number;
    limit?: number;
    search?: string;
    includeInactive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

const CategoryService = {
    async list(params: CategoryListParams = {}): Promise<PaginatedResponse<Category>> {
        const response = await api.get("/categories", { params });
        const data = response.data;
        const items: Category[] = Array.isArray(data.data) ? data.data.map(mapBackendCategory) : [];
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
};

export default CategoryService;


