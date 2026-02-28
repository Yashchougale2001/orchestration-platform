import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

/**
 * Chat service - handles all chat-related API calls
 */
export const chatService = {
  /**
   * Send a query to the RAG system
   * @param {Object} params - Query parameters
   * @param {string} params.question - User's question
   * @param {string} params.userId - User ID
   * @param {string} params.role - User role
   * @returns {Promise<Object>} - API response with answer, steps, and sources
   */
  sendQuery: async ({ question, userId, role }) => {
    const response = await apiClient.post(endpoints.chat.query, {
      question,
      user_id: userId,
      role,
    });
    return response.data;
  },

  /**
   * Get chat history for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} - Array of chat messages
   */
  getHistory: async (userId) => {
    const response = await apiClient.get(endpoints.chat.history, {
      params: { user_id: userId },
    });
    return response.data;
  },
};
