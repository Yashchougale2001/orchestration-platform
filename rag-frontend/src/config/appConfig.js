/**
 * Centralized application configuration
 * All configurable values should be defined here
 */
export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || "RAG Assistant",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",

  // Theme configuration
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
  },

  // Feature flags
  features: {
    enableFeedback: true,
    enableIngestion: true,
    enableAdminPanel: true,
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 20,
  },
};
