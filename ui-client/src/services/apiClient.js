// // export const apiClient = {
// //   get: async (url, config) => {
// //     // GET implementation
// //   },
// //   post: async (url, data, config) => {
// //     // POST implementation
// //   },
// //   put: async (url, data, config) => {
// //     // PUT implementation
// //   },
// //   delete: async (url, config) => {
// //     // DELETE implementation
// //   },
// // };
// import axios from "axios";
// import { appConfig } from "../config/appConfig";
// import { STORAGE_KEYS } from "../utils/constants";

// /**
//  * Axios instance configured for the RAG API
//  * Includes request/response interceptors for auth and error handling
//  */
// const apiClient = axios.create({
//   baseURL: appConfig.apiBaseUrl,
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor - adds auth token if available
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor - handles common error cases
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle specific error codes
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // Clear auth and redirect to login
//           localStorage.removeItem(STORAGE_KEYS.USER);
//           localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
//           window.location.href = "/login";
//           break;
//         case 403:
//           console.error("Access forbidden");
//           break;
//         case 500:
//           console.error("Server error");
//           break;
//         default:
//           break;
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default apiClient;
import axios from "axios";
import { appConfig } from "../config/appConfig";

/**
 * Axios instance configured for the RAG API
 * Includes request/response interceptors for logging and error handling
 */
const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 120000, // 2 minutes timeout (RAG can take time for complex queries)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - logs outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      if (config.data && !(config.data instanceof FormData)) {
        console.log("📦 Request Data:", config.data);
      }
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - handles responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log("📦 Response Data:", response.data);
    }
    return response;
  },
  (error) => {
    // Detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error(
        `❌ API Error ${error.response.status}:`,
        error.response.data,
      );

      switch (error.response.status) {
        case 400:
          console.error("Bad Request - Check your request data");
          break;
        case 404:
          console.error("Endpoint not found:", error.config.url);
          break;
        case 422:
          console.error("Validation Error:", error.response.data.detail);
          break;
        case 500:
          console.error("Server Error - Check backend logs");
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("❌ No response received from server");
      console.error("Is the backend running at", appConfig.apiBaseUrl, "?");
    } else {
      // Error in setting up request
      console.error("❌ Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
