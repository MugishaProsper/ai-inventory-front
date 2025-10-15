import React, { createContext, useContext, useEffect, useReducer } from 'react'
import AnalyticsService, { DashboardAnalyticsResponse } from '@/services/analytics.service'

interface AnalyticsState {
  dashboard: DashboardAnalyticsResponse | null
  loading: boolean
  error: string | null
}

type AnalyticsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DASHBOARD'; payload: DashboardAnalyticsResponse }

const initialState: AnalyticsState = {
  dashboard: null,
  loading: false,
  error: null,
}

function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload, loading: false, error: null }
    default:
      return state
  }
}

interface AnalyticsContextType extends AnalyticsState {
  refresh: (period?: string) => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState)

  const load = async (period: string = '30d') => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await AnalyticsService.dashboard(period)
      dispatch({ type: 'SET_DASHBOARD', payload: res.data })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load analytics' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    load('30d')
  }, [])

  return (
    <AnalyticsContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error('useAnalytics must be used within an AnalyticsProvider')
  return ctx
}
