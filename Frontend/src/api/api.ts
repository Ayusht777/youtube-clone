import axiosInstance from "../lib/axios";
import {
  ApiResponse,
  LoginFormData,
  RegisterFormData,
  UserData,
} from "../types/index";

const UserApi = {
  register: async (data: RegisterFormData) => {
    const response = await axiosInstance.post("/user/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  login: async (data: LoginFormData): Promise<ApiResponse<UserData>> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data;
  },
};

export default UserApi;
