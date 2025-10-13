import { User } from "@/types/User";
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
    loading: boolean;
    register: (fullname: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { loading } = state;

    const register = async (fullname: string, email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            
            // TODO: Replace with your actual registration API call
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            const user = await response.json();
            dispatch({ type: 'SET_AUTHENTICATED_USER', payload: user });
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