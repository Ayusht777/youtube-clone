import { useAuthStore } from "@/store/authStore";
import axiosInstance from "../lib/axios";
import { ApiError, ApiResponse, LoginFormData, UserData } from "../types/index";

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
    const { accessToken } = useAuthStore.getState();
    console.log(accessToken);
    try {
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
};
