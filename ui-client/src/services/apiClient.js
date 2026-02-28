// export const apiClient = {
//   get: async (url, config) => {
//     // GET implementation
//   },
//   post: async (url, data, config) => {
//     // POST implementation
//   },
//   put: async (url, data, config) => {
//     // PUT implementation
//   },
//   delete: async (url, config) => {
//     // DELETE implementation
//   },
// };
import axios from "axios";
import { appConfig } from "../config/appConfig";
import { STORAGE_KEYS } from "../utils/constants";

/**
 * Axios instance configured for the RAG API
 * Includes request/response interceptors for auth and error handling
 */
const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Clear auth and redirect to login
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
