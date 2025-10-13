import AuthService from "@/services/auth.service";
import { RegisteringUser, User } from "@/types/User";
import React, { createContext, useContext, useReducer } from "react";

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'SET_AUTHENTICATED_USER'; payload: User }

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_AUTHENTICATED_USER':
            return { ...state, user: action.payload, loading: false, error: null };
        default:
            return state;
    }
}

interface AuthContextType extends AuthState {
    register: (userData: RegisteringUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { loading } = state;

    const register = async (registrationData : RegisteringUser) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            const response = await AuthService.register(registrationData)

            if (!response.success) {
                throw new Error(response.message || 'Registration failed');
            }

            // dispatch({ type: 'SET_AUTHENTICATED_USER', payload: response.data });
        } catch (error) {
            dispatch({ 
                type: 'SET_ERROR', 
                payload: error instanceof Error ? error.message : 'Registration failed' 
            });
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            ...state, 
            loading,
            register 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}