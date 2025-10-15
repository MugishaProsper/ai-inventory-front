import React, { createContext, useContext, useEffect, useReducer } from 'react'
import CategoryService from '@/services/category.service'
import { Category } from '@/types'

interface CategoriesState {
  categories: Category[]
  loading: boolean
  error: string | null
}

type CategoriesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CATEGORIES'; payload: Category[] }

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
}

function categoriesReducer(state: CategoriesState, action: CategoriesAction): CategoriesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload, loading: false, error: null }
    default:
      return state
  }
}

interface CategoriesContextType extends CategoriesState {
  refresh: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(categoriesReducer, initialState)

  const load = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await CategoryService.list({ page: 1, limit: 50 })
      dispatch({ type: 'SET_CATEGORIES', payload: res.data })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load categories' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <CategoriesContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategories() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider')
  return ctx
}
