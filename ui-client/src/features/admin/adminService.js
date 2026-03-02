// import apiClient from "../../services/apiClient";
// import { endpoints } from "../../services/endpoints";

// /**
//  * Admin service - handles admin panel API calls
//  */
// export const adminService = {
//   /**
//    * Get system logs
//    * @param {Object} params - Query parameters
//    * @returns {Promise<Array>} - Array of log entries
//    */
//   getLogs: async (params = {}) => {
//     const response = await apiClient.get(endpoints.admin.logs, { params });
//     return response.data;
//   },

//   /**
//    * Get system statistics
//    * @returns {Promise<Object>} - Statistics data
//    */
//   getStats: async () => {
//     const response = await apiClient.get(endpoints.admin.stats);
//     return response.data;
//   },

//   /**
//    * Get mocked stats for demo
//    * @returns {Object} - Mocked statistics
//    */
//   getMockedStats: () => ({
//     totalQueries: 1247,
//     totalIngestions: 89,
//     totalUsers: 156,
//     avgResponseTime: "1.2s",
//     queriesThisWeek: [45, 52, 38, 61, 55, 48, 72],
//     topSources: [
//       { name: "HR_Policy.pdf", count: 234 },
//       { name: "IT_Assets.xlsx", count: 187 },
//       { name: "Guidelines.md", count: 156 },
//     ],
//   }),

//   /**
//    * Get mocked logs for demo
//    * @returns {Array} - Mocked log entries
//    */
//   getMockedLogs: () => [
//     {
//       id: 1,
//       timestamp: new Date().toISOString(),
//       level: "INFO",
//       message: "Query processed successfully",
//       user: "user123",
//     },
//     {
//       id: 2,
//       timestamp: new Date().toISOString(),
//       level: "INFO",
//       message: "File ingested: policy.pdf",
//       user: "admin",
//     },
//     {
//       id: 3,
//       timestamp: new Date().toISOString(),
//       level: "WARNING",
//       message: "Slow query detected (2.5s)",
//       user: "user456",
//     },
//     {
//       id: 4,
//       timestamp: new Date().toISOString(),
//       level: "ERROR",
//       message: "Failed to connect to LLM",
//       user: "system",
//     },
//     {
//       id: 5,
//       timestamp: new Date().toISOString(),
//       level: "INFO",
//       message: "User login successful",
//       user: "hr_manager",
//     },
//   ],
// };
import apiClient from "../../services/apiClient";

/**
 * Admin service - handles admin dashboard API calls
 */
export const adminService = {
  /**
   * Get system statistics
   * @returns {Promise<Object>} - Stats data
   */
  getStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  /**
   * Get top document sources
   * @param {number} limit - Number of sources to return
   * @returns {Promise<Object>} - Top sources data
   */
  getTopSources: async (limit = 10) => {
    const response = await apiClient.get("/admin/top-sources", {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get system logs
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.pageSize - Items per page
   * @param {string} params.level - Filter by log level
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} - Logs data
   */
  getLogs: async ({
    page = 1,
    pageSize = 50,
    level = null,
    search = null,
  } = {}) => {
    const params = { page, page_size: pageSize };
    if (level) params.level = level;
    if (search) params.search = search;

    const response = await apiClient.get("/admin/logs", { params });
    return response.data;
  },

  /**
   * Get active users
   * @returns {Promise<Object>} - Active users data
   */
  getActiveUsers: async () => {
    const response = await apiClient.get("/admin/active-users");
    return response.data;
  },

  /**
   * Get feedback summary
   * @returns {Promise<Object>} - Feedback summary data
   */
  getFeedbackSummary: async () => {
    const response = await apiClient.get("/admin/feedback-summary");
    return response.data;
  },

  /**
   * Get query logs
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Query logs data
   */
  getQueryLogs: async ({ page = 1, pageSize = 20, userId = null } = {}) => {
    const params = { page, page_size: pageSize };
    if (userId) params.user_id = userId;

    const response = await apiClient.get("/admin/query-logs", { params });
    return response.data;
  },
};
