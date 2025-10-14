import { LoggingUser, RegisteringUser, User } from "@/types/User";
import api from "@/lib/api";

const AuthService = {
  /**
   * Login user with email and password
   * Sets HTTP-only cookie with authentication token
   */
  login: async (data: LoggingUser) => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // After successful login, fetch the user data
      const user = await AuthService.getCurrentUser();
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  },

  /**
   * Register a new user
   */
  register: async (data: RegisteringUser): Promise<BaseAPIResponse<User>> => {
    try {
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        fullname: data.fullname,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // After successful registration, login the user
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
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (!response.data.success) {
        throw new Error(response.data.message);
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
      if (!response.data.success) {
        throw new Error(response.data.message);
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
  getCurrentUser: async (): Promise<BaseAPIResponse<User>> => {
    try {
      const response = await api.get("/auth/me");
      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      return response.data;
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
      if (!response.success) {
        return false;
      }
      return true;
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
  ): Promise<BaseAPIResponse<void>> => {
    try {
        const response = await api.post("/auth/change-password", {
            oldPassword,
            newPassword
        })
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      throw new Error(errorMessage);
    }
  },
};

export default AuthService;
