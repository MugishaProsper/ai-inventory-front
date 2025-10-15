import api from "@/lib/api";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import { Product } from "@/types";

type BackendProduct = any; // If backend types are added later, replace any with exact shape

function mapBackendProduct(p: BackendProduct): Product {
  return {
    id: p._id ?? p.id,
    name: p.name,
    sku: p.sku,
    category: typeof p.category === "string" ? p.category : p.category?._id ?? p.category?.name ?? "",
    description: p.description,
    price: Number(p.price),
    cost: Number(p.cost),
    quantity: Number(p.quantity),
    minStock: Number(p.minStock),
    maxStock: Number(p.maxStock),
    supplier: typeof p.supplier === "string" ? p.supplier : p.supplier?._id ?? p.supplier?.name ?? "",
    location: p.location ?? "",
    imageUrl: Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
    updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    status: (p.status ?? "ACTIVE").toString().toUpperCase(),
    tags: Array.isArray(p.tags) ? p.tags : [],
  } as Product;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  supplier?: string;
  status?: string;
  stockStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const ProductService = {
  async list(params: ProductListParams = {}): Promise<PaginatedResponse<Product>> {
    const response = await api.get("/products", { params });
    const data = response.data;
    const items: Product[] = Array.isArray(data.data) ? data.data.map(mapBackendProduct) : [];
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

export default ProductService;


