import AuthService from "@/services/auth.service";
import { LoggingUser, RegisteringUser, User } from "@/types/User";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { ApiResponse } from "@/types/api.types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_AUTHENTICATED_USER"; payload: User | null };

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_AUTHENTICATED_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  register: (userData: RegisteringUser) => Promise<{ success: boolean; message?: string }>;
  login: (userData: LoggingUser) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { loading } = state;

  // Hydrate session on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const me: ApiResponse<User> = await AuthService.getCurrentUser();
        if (isMounted && me?.success && me?.data) {
          dispatch({ type: "SET_AUTHENTICATED_USER", payload: me.data });
          // optionally cache user
          localStorage.setItem("user", JSON.stringify(me.data));
        }
      } catch {
        // not authenticated is fine
      } finally {
        if (isMounted) dispatch({ type: "SET_LOADING", payload: false });
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (registrationData: RegisteringUser): Promise<{ success: boolean; message?: string }> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.register(registrationData);

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (loginData: LoggingUser): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await AuthService.login(loginData);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({ type: "SET_AUTHENTICATED_USER", payload: response.data });
      return { success: true, user: response.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await AuthService.logout();
      dispatch({ type: "SET_AUTHENTICATED_USER", payload: null });
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed";
      dispatch({
        type: "SET_ERROR",
        payload: errorMessage,
      });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
