import { useAuthStore } from "@/store/authStore";
import axiosInstance from "../lib/axios";
import { ApiError, ApiResponse, LoginFormData, UserData, UpdateUserProfileData } from "../types/index";

export const UserApi = {
  register: async (data: FormData): Promise<ApiResponse<UserData>> => {
    try {
      const response = await axiosInstance.post("/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
  login: async (data: LoginFormData): Promise<ApiResponse<UserData>> => {
    try {
      const response = await axiosInstance.post("/users/login", data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
  logout: async (): Promise<void> => {
    try {
      const { accessToken } = useAuthStore.getState();
      await axiosInstance.post(
        "/users/logout",
        {},
        {
          // Pass an empty object as the body
          headers: {
            Authorization: `Bearer ${accessToken}`, // Correctly format the Authorization header
          },
        }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },
  getCurrentUser: async (): Promise<ApiResponse<UserData>> => {
    try {
      const { accessToken } = useAuthStore.getState();
      const response = await axiosInstance.get("/users/getCurrentUser", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
  updateUserProfile: async (data: UpdateUserProfileData): Promise<ApiResponse<UserData>> => {
    try {
      const { accessToken } = useAuthStore.getState();
      const response = await axiosInstance.patch(
        "/users/updateAccountDetails",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
  refreshToken: async (): Promise<ApiResponse<UserData>> => {
    try {
      const { refreshToken } = useAuthStore.getState();
      const response = await axiosInstance.post("/users/refresh-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      useAuthStore.setState({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};
