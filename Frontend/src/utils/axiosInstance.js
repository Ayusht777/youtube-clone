import axios from "axios";
import { getApiConfig } from "../config/config";

const config = getApiConfig();
// Creates and exports a configured axios instance with:
// - Dynamic base URL from environment config
// - Cross-origin credentials enabled
// - 8 second timeout
// - JSON content type header
export const apiClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Multipart instance or from file upload
export const uploadClient = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
  timeout: 8000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});