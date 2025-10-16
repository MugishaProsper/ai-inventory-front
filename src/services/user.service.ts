import api from "@/lib/api";

export interface BackendUser {
  _id: string
  fullname?: string
  username?: string
  email: string
  phone_number?: number
  address?: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  user: BackendUser
}

const UserService = {
  async getProfile(): Promise<ProfileResponse> {
    const res = await api.get("/users");
    return res.data;
  },
  async updateProfile(payload: Partial<BackendUser>): Promise<{ success: boolean; message: string }> {
    // Backend updateUser uses req.user.id (authenticated user), not req.params.userId
    const res = await api.put("/users/me", payload);
    return res.data;
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await api.put("/users/change-password", { oldPassword: currentPassword, newPassword: newPassword });
    return res.data;
  },
};

export default UserService;


