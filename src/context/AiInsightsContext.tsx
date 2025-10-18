import React, { createContext, useContext, useEffect, useReducer } from 'react'
import AIService, { AIInsightItem } from '@/services/ai.service'

interface AiInsightsState {
  insights: AIInsightItem[]
  summary: any | null
  loading: boolean
  error: string | null
}

type AiInsightsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INSIGHTS'; payload: AIInsightItem[] }
  | { type: 'SET_SUMMARY'; payload: any }

const initialState: AiInsightsState = {
  insights: [],
  summary: null,
  loading: false,
  error: null,
}

function aiReducer(state: AiInsightsState, action: AiInsightsAction): AiInsightsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload, loading: false, error: null }
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload }
    default:
      return state
  }
}

interface AiInsightsContextType extends AiInsightsState {
  refresh: (params?: { type?: string; priority?: string; status?: string }) => Promise<void>
}

const AiInsightsContext = createContext<AiInsightsContextType | undefined>(undefined)

export function AiInsightsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiReducer, initialState)

  const load = async (params?: { type?: string; priority?: string; status?: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const [listRes, summaryRes] = await Promise.all([
        AIService.list({ status: 'active', ...params }),
        AIService.summary(),
      ])
      dispatch({ type: 'SET_INSIGHTS', payload: listRes.data })
      dispatch({ type: 'SET_SUMMARY', payload: summaryRes.data })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load AI insights' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    load()
  })

  return (
    <AiInsightsContext.Provider value={{ ...state, refresh: load }}>
      {children}
    </AiInsightsContext.Provider>
  )
}

export function useAiInsights() {
  const ctx = useContext(AiInsightsContext)
  if (!ctx) throw new Error('useAiInsights must be used within an AiInsightsProvider')
  return ctx
}
