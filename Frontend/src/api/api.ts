import axiosInstance from "../lib/axios";
import {
  ApiResponse,
  LoginFormData,
  RegisterFormData,
  UserData,
} from "../types/index";

export const UserApi = {
  register: async (data: RegisterFormData) => {
    const response = await axiosInstance.post("/users/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  login: async (data: LoginFormData): Promise<ApiResponse<UserData>> => {
    const response = await axiosInstance.post("/users/login", data);
    return response.data;
  },
};
