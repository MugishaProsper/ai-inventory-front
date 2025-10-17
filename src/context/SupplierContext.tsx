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
  createSupplier: (payload: FormData) => Promise<void>
  updateSupplier: (id: string, payload: FormData | any) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>
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

  const updateSupplier = async (id: string, payload: FormData | any) => {
    await SupplierService.update(id, payload)
    await load()
  }

  const deleteSupplier = async (id: string) => {
    await SupplierService.delete(id)
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <SupplierContext.Provider value={{ ...state, refresh: load, createSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  )
}

export function useSuppliers() {
  const ctx = useContext(SupplierContext)
  if (!ctx) throw new Error('useSuppliers must be used within a SupplierProvider')
  return ctx
}
