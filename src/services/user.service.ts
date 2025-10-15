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
  async updateProfile(userId: string, payload: Partial<BackendUser>): Promise<{ success: boolean; message: string }> {
    const res = await api.put(`/users/${userId}`, payload);
    return res.data;
  },
};

export default UserService;


