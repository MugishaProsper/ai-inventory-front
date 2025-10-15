import { LoggingUser, RegisteringUser, User } from "@/types/User";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";

const AuthService = {
  /**
   * Login user with email and password
   * Sets HTTP-only cookie with authentication token
   */
  login: async (data: LoggingUser): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      // Backend returns only { message } on success and sets an HTTP-only cookie
      if (response.status >= 200 && response.status < 300) {
        const me = await AuthService.getCurrentUser();
        return me;
      }
      throw new Error(response.data?.message || "Login failed");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisteringUser): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        fullname: data.fullname,
      });

      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(response.data?.message || "Registration failed");
      }

      // After successful registration, login the user to set cookie and fetch profile
      return await AuthService.login({
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      // Even if the request fails, we still want to proceed with local logout
      console.error("Logout failed:", error);
    }
    // Clear any local user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(response.data?.message || "Failed to send reset email");
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email";
      throw new Error(errorMessage);
    }
  },

  /**
   * Reset password with token from email
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      if (!(response.status >= 200 && response.status < 300)) {
        throw new Error(response.data?.message || "Failed to reset password");
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      throw new Error(errorMessage);
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get("/auth/me");
      // Backend returns { success, message, user }
      if (response?.data?.success && response?.data?.user) {
        return {
          success: true,
          message: response.data.message || "User fetched",
          data: response.data.user as User,
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error(response?.data?.message || "Not authenticated");
    } catch (error: any) {
      // If not authenticated, clear any stored user data
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
      }
      throw new Error(error.response?.data?.message || "Not authenticated");
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await AuthService.getCurrentUser();
      return !!response?.success && !!response?.data;
    } catch {
      return false;
    }
  },

  /**
   * Change user password
   */
  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post("/auth/change-password", {
        oldPassword,
        newPassword
      })
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data?.message || "Password changed", data: undefined as unknown as void };
      }
      throw new Error(response.data?.message || "Failed to change password");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      throw new Error(errorMessage);
    }
  },
};

export default AuthService;
