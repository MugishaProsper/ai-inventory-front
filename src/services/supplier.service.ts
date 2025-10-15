import api from "@/lib/api";
import { PaginatedResponse } from "@/types/api.types";

export interface SupplierListItem {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    rating?: number
    productsSupplied?: number
    createdAt?: Date
}

type BackendSupplier = any;

function mapBackendSupplier(s: BackendSupplier): SupplierListItem {
    return {
        id: s._id ?? s.id,
        name: s.name,
        email: s.contact?.email,
        phone: s.contact?.phone,
        address: s.address ? [s.address.street, s.address.city, s.address.state, s.address.zipCode, s.address.country].filter(Boolean).join(", ") : undefined,
        rating: s.performance?.rating ?? 0,
        productsSupplied: s.productsSupplied ?? s.performance?.totalOrders ?? 0,
        createdAt: s.createdAt ? new Date(s.createdAt) : undefined,
    };
}

export interface SupplierListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    minRating?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

const SupplierService = {
    async list(params: SupplierListParams = {}): Promise<PaginatedResponse<SupplierListItem>> {
        const response = await api.get("/suppliers", { params });
        const data = response.data;
        const items: SupplierListItem[] = Array.isArray(data.data) ? data.data.map(mapBackendSupplier) : [];
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

export default SupplierService;


