import React, { createContext, useContext, useEffect, useReducer } from 'react'
import ProductService from '@/services/product.service'
import { Product } from '@/types'

interface ProductState {
  products: Product[]
  loading: boolean
  error: string | null
}

type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
}

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null }
    default:
      return state
  }
}

interface ProductContextType extends ProductState {
  refresh: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>
  createProduct: (payload: Partial<Product>) => Promise<void>
  updateProduct: (productId: string, payload: Partial<Product>) => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState)

  const load = async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await ProductService.list({ page: params?.page ?? 1, limit: params?.limit ?? 20, search: params?.search })
      dispatch({ type: 'SET_PRODUCTS', payload: res.data })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load products' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createProduct = async (payload: Partial<Product>) => {
    await ProductService.create(payload)
    await load()
  }

  const updateProduct = async (productId: string, payload: Partial<Product>) => {
    await ProductService.update(productId, payload)
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <ProductContext.Provider value={{ ...state, refresh: load, createProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider')
  return ctx
}
