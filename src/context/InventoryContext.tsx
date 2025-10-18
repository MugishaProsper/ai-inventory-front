import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { Product, Category, Supplier, StockMovement, DashboardStats, AIInsight, FilterOptions } from '@/types'
import { mockCategories, mockSuppliers, mockStockMovements, mockDashboardStats, mockAIInsights } from '@/data/mockData'
import ProductService from '@/services/product.service'
import DashboardService, { DashboardAnalytics } from '@/services/dashboard.service'
import AnalyticsService from '@/services/analytics.service'

interface InventoryState {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  stockMovements: StockMovement[]
  dashboardStats: DashboardStats
  dashboardAnalytics: DashboardAnalytics | null
  aiInsights: AIInsight[]
  loading: boolean
  error: string | null
  filters: FilterOptions
}

type InventoryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_SUPPLIERS'; payload: Supplier[] }
  | { type: 'ADD_SUPPLIER'; payload: Supplier }
  | { type: 'SET_STOCK_MOVEMENTS'; payload: StockMovement[] }
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_DASHBOARD_ANALYTICS'; payload: DashboardAnalytics }
  | { type: 'SET_AI_INSIGHTS'; payload: AIInsight[] }
  | { type: 'SET_FILTERS'; payload: FilterOptions }
  | { type: 'RESET_FILTERS' }

const initialState: InventoryState = {
  products: [],
  categories: [],
  suppliers: [],
  stockMovements: [],
  dashboardStats: {} as DashboardStats,
  dashboardAnalytics: null,
  aiInsights: [],
  loading: false,
  error: null,
  filters: {},
}

function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload }
    case 'ADD_SUPPLIER':
      return { ...state, suppliers: [...state.suppliers, action.payload] }
    case 'SET_STOCK_MOVEMENTS':
      return { ...state, stockMovements: action.payload }
    case 'ADD_STOCK_MOVEMENT':
      return { ...state, stockMovements: [action.payload, ...state.stockMovements] }
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload }
    case 'SET_DASHBOARD_ANALYTICS':
      return { ...state, dashboardAnalytics: action.payload }
    case 'SET_AI_INSIGHTS':
      return { ...state, aiInsights: action.payload }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: {} }
    default:
      return state
  }
}

interface InventoryContextType {
  state: InventoryState
  dispatch: React.Dispatch<InventoryAction>
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void
  getFilteredProducts: () => Product[]
  refreshDashboardStats: () => void
  loadDashboardData: (period?: string) => Promise<void>
  loadDashboardAnalytics: (period?: string) => Promise<void>
  loadAIInsights: () => Promise<void>
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState)

  // Initialize data
  useEffect(() => {
    let isMounted = true
      ; (async () => {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          const productsRes = await ProductService.list({ page: 1, limit: 20 })
          if (isMounted && productsRes.success) {
            dispatch({ type: 'SET_PRODUCTS', payload: productsRes.data })
          }
          // Keep mock placeholders for other domains until services are implemented
          dispatch({ type: 'SET_CATEGORIES', payload: mockCategories })
          dispatch({ type: 'SET_SUPPLIERS', payload: mockSuppliers })
          dispatch({ type: 'SET_STOCK_MOVEMENTS', payload: mockStockMovements })
          dispatch({ type: 'SET_DASHBOARD_STATS', payload: mockDashboardStats })
          dispatch({ type: 'SET_AI_INSIGHTS', payload: mockAIInsights })
        } catch (e: any) {
          dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load inventory' })
        } finally {
          if (isMounted) dispatch({ type: 'SET_LOADING', payload: false })
        }
      })()
    return () => {
      isMounted = false
    }
  }, [])

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct })
  }

  const updateProduct = (product: Product) => {
    const updatedProduct = { ...product, updatedAt: new Date() }
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct })
  }

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id })
  }

  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      createdAt: new Date(),
    }
    dispatch({ type: 'ADD_STOCK_MOVEMENT', payload: newMovement })

    // Update product quantity
    const product = state.products.find(p => p.id === movementData.productId)
    if (product) {
      const newQuantity = movementData.type === 'IN'
        ? product.quantity + movementData.quantity
        : product.quantity - movementData.quantity

      updateProduct({ ...product, quantity: Math.max(0, newQuantity) })
    }
  }

  const getFilteredProducts = (): Product[] => {
    let filtered = [...state.products]

    if (state.filters.search) {
      const search = state.filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      )
    }

    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category)
    }

    if (state.filters.supplier) {
      filtered = filtered.filter(product => product.supplier === state.filters.supplier)
    }

    if (state.filters.status) {
      filtered = filtered.filter(product => product.status === state.filters.status)
    }

    if (state.filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= state.filters.minPrice!)
    }

    if (state.filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= state.filters.maxPrice!)
    }

    if (state.filters.minStock !== undefined) {
      filtered = filtered.filter(product => product.quantity >= state.filters.minStock!)
    }

    if (state.filters.maxStock !== undefined) {
      filtered = filtered.filter(product => product.quantity <= state.filters.maxStock!)
    }

    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[state.filters.sortBy!]
        const bValue = (b as any)[state.filters.sortBy!]

        if (state.filters.sortOrder === 'DESC') {
          return bValue > aValue ? 1 : -1
        }
        return aValue > bValue ? 1 : -1
      })
    }

    return filtered
  }

  const refreshDashboardStats = () => {
    // Recalculate dashboard stats based on current data
    const totalProducts = state.products.length
    const totalValue = state.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
    const lowStockItems = state.products.filter(product => product.quantity <= product.minStock).length
    const outOfStockItems = state.products.filter(product => product.quantity === 0).length

    const updatedStats: DashboardStats = {
      ...state.dashboardStats,
      totalProducts,
      totalValue,
      lowStockItems,
      outOfStockItems,
    }

    dispatch({ type: 'SET_DASHBOARD_STATS', payload: updatedStats })
  }

  // Load comprehensive dashboard data from backend (single optimized call)
  const loadDashboardData = useCallback(async (period: string = '30d') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      console.log('Loading dashboard data for period:', period)

      // Try the new optimized endpoint first
      try {
        const response = await DashboardService.getDashboardData(period)
        if (response.success) {
          console.log('Dashboard data loaded successfully:', response.data)
          // Set all dashboard data at once
          dispatch({ type: 'SET_DASHBOARD_ANALYTICS', payload: response.data })
          // AI insights are included in the dashboard data
          if (response.data.aiInsights && Array.isArray(response.data.aiInsights)) {
            dispatch({ type: 'SET_AI_INSIGHTS', payload: response.data.aiInsights })
          }
          return
        }
      } catch (newEndpointError) {
        console.warn('New endpoint failed, trying analytics service:', newEndpointError)
      }

      // Fallback to existing analytics service
      const response = await AnalyticsService.dashboard(period)
      if (response.success) {
        console.log('Analytics service data loaded:', response.data)
        // Transform the data to match our expected format
        const transformedData = {
          summary: response.data.summary,
          charts: response.data.charts,
          topSellingProducts: response.data.topSellingProducts,
          recentAlerts: response.data.recentAlerts,
          recentActivity: [],
          aiInsights: [],
          period: response.data.period
        }
        dispatch({ type: 'SET_DASHBOARD_ANALYTICS', payload: transformedData as DashboardAnalytics })
      }
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Failed to load dashboard data' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, []) // Empty dependency array since this function doesn't depend on any props or state

  // Legacy method for backward compatibility
  const loadDashboardAnalytics = useCallback(async (period: string = '30d') => {
    return loadDashboardData(period)
  }, [loadDashboardData])

  // Legacy method for backward compatibility
  const loadAIInsights = useCallback(async () => {
    // AI insights are now loaded with dashboard data
    console.log('AI insights are loaded with dashboard data')
  }, [])

  const contextValue: InventoryContextType = {
    state,
    dispatch,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockMovement,
    getFilteredProducts,
    refreshDashboardStats,
    loadDashboardData,
    loadDashboardAnalytics,
    loadAIInsights,
  }

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}