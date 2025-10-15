export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    timestamp?: string
}

export interface PaginatedResponse<T> {
    success: boolean
    message: string
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
    timestamp?: string
}

export interface ApiError {
    success: false
    message: string
}

export type Maybe<T> = T | null