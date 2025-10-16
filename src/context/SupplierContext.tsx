import React, { createContext, useContext, useEffect, useReducer } from 'react'
import SupplierService, { SupplierListItem } from '@/services/supplier.service'

interface SupplierState {
  suppliers: SupplierListItem[]
  loading: boolean
  error: string | null
}

type SupplierAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUPPLIERS'; payload: SupplierListItem[] }

const initialState: SupplierState = {
  suppliers: [],
  loading: false,
  error: null,
}

function supplierReducer(state: SupplierState, action: SupplierAction): SupplierState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_SUPPLIERS':
      return { ...state, suppliers: action.payload, loading: false, error: null }
    default:
      return state
  }
}

interface SupplierContextType extends SupplierState {
  refresh: () => Promise<void>
  createSupplier: (payload: {
    name: string;
    code?: string;
    contact?: { email?: string; phone?: string; website?: string; contactPerson?: string };
    address?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string };
    tags?: string[];
    notes?: string;
  }) => Promise<void>
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined)

export function SupplierProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(supplierReducer, initialState)

  const load = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await SupplierService.list({ page: 1, limit: 50 })
      dispatch({ type: 'SET_SUPPLIERS', payload: res.data })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load suppliers' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createSupplier: SupplierContextType['createSupplier'] = async (payload) => {
    await SupplierService.create(payload)
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <SupplierContext.Provider value={{ ...state, refresh: load, createSupplier }}>
      {children}
    </SupplierContext.Provider>
  )
}

export function useSuppliers() {
  const ctx = useContext(SupplierContext)
  if (!ctx) throw new Error('useSuppliers must be used within a SupplierProvider')
  return ctx
}
