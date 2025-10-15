import React, { createContext, useContext, useEffect, useReducer } from 'react'
import UserService, { BackendUser } from '@/services/user.service'

interface SettingsState {
  profile: BackendUser | null
  loading: boolean
  error: string | null
  darkMode: boolean
}

type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: BackendUser }
  | { type: 'SET_DARK_MODE'; payload: boolean }

const initialState: SettingsState = {
  profile: null,
  loading: false,
  error: null,
  darkMode: false,
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, loading: false, error: null }
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload }
    default:
      return state
  }
}

interface SettingsContextType extends SettingsState {
  refreshProfile: () => Promise<void>
  updateProfile: (payload: Partial<BackendUser>) => Promise<void>
  toggleDarkMode: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)

  const refreshProfile = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await UserService.getProfile()
      dispatch({ type: 'SET_PROFILE', payload: res.user })
    } catch (e: any) {
      dispatch({ type: 'SET_ERROR', payload: e?.message || 'Failed to load profile' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateProfile = async (payload: Partial<BackendUser>) => {
    if (!state.profile) return
    await UserService.updateProfile(state.profile._id, payload)
    await refreshProfile()
  }

  const toggleDarkMode = () => {
    const next = !state.darkMode
    dispatch({ type: 'SET_DARK_MODE', payload: next })
    document.documentElement.classList.toggle('dark', next)
  }

  useEffect(() => {
    refreshProfile()
  }, [])

  return (
    <SettingsContext.Provider value={{ ...state, refreshProfile, updateProfile, toggleDarkMode }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider')
  return ctx
}


