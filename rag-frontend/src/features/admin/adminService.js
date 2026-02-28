import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

/**
 * Admin service - handles admin panel API calls
 */
export const adminService = {
  /**
   * Get system logs
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - Array of log entries
   */
  getLogs: async (params = {}) => {
    const response = await apiClient.get(endpoints.admin.logs, { params });
    return response.data;
  },

  /**
   * Get system statistics
   * @returns {Promise<Object>} - Statistics data
   */
  getStats: async () => {
    const response = await apiClient.get(endpoints.admin.stats);
    return response.data;
  },

  /**
   * Get mocked stats for demo
   * @returns {Object} - Mocked statistics
   */
  getMockedStats: () => ({
    totalQueries: 1247,
    totalIngestions: 89,
    totalUsers: 156,
    avgResponseTime: "1.2s",
    queriesThisWeek: [45, 52, 38, 61, 55, 48, 72],
    topSources: [
      { name: "HR_Policy.pdf", count: 234 },
      { name: "IT_Assets.xlsx", count: 187 },
      { name: "Guidelines.md", count: 156 },
    ],
  }),

  /**
   * Get mocked logs for demo
   * @returns {Array} - Mocked log entries
   */
  getMockedLogs: () => [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "Query processed successfully",
      user: "user123",
    },
    {
      id: 2,
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "File ingested: policy.pdf",
      user: "admin",
    },
    {
      id: 3,
      timestamp: new Date().toISOString(),
      level: "WARNING",
      message: "Slow query detected (2.5s)",
      user: "user456",
    },
    {
      id: 4,
      timestamp: new Date().toISOString(),
      level: "ERROR",
      message: "Failed to connect to LLM",
      user: "system",
    },
    {
      id: 5,
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "User login successful",
      user: "hr_manager",
    },
  ],
};
