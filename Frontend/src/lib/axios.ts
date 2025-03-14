import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config/api.config";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
