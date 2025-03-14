import axios, { AxiosError, AxiosInstance } from "axios";
import { API_CONFIG } from "../config/api.config";
import { ApiError } from "../types/index";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if the error is an AxiosError and has a response
    if (error.response) {
      const errorResponse = error.response.data as ApiError;

      // Return a standardized error object
      return Promise.reject({
        statusCode: errorResponse.statusCode || error.response.status || 500,
        message: errorResponse.message || "An unexpected error occurred",
        success: false,
        errors: errorResponse.errors || [],
        data: null,
      } as ApiError);
    }

    // Handle network or other errors
    return Promise.reject({
      statusCode: 500,
      message: "Network Error or Server is unreachable",
      success: false,
      errors: [],
      data: null,
    } as ApiError);
  }
);

export default axiosInstance;
