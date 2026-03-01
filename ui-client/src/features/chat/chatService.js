// import apiClient from "../../services/apiClient";
// import { endpoints } from "../../services/endpoints";

// /**
//  * Chat service - handles all chat-related API calls
//  */
// export const chatService = {
//   /**
//    * Send a query to the RAG system
//    * @param {Object} params - Query parameters
//    * @param {string} params.question - User's question
//    * @param {string} params.userId - User ID
//    * @param {string} params.role - User role
//    * @returns {Promise<Object>} - API response with answer, steps, and sources
//    */
//   sendQuery: async ({ question, userId, role }) => {
//     const response = await apiClient.post(endpoints.chat.query, {
//       question,
//       user_id: userId,
//       role,
//     });
//     return response.data;
//   },

//   /**
//    * Get chat history for a user
//    * @param {string} userId - User ID
//    * @returns {Promise<Array>} - Array of chat messages
//    */
//   getHistory: async (userId) => {
//     const response = await apiClient.get(endpoints.chat.history, {
//       params: { user_id: userId },
//     });
//     return response.data;
//   },
// };
import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

// ✅ Set to FALSE to use real backend
const USE_MOCK = false;

/**
 * Chat service - handles all chat-related API calls
 */
export const chatService = {
  /**
   * Send a query to the RAG system
   * @param {Object} params - Query parameters
   * @param {string} params.question - User's question
   * @param {string} params.userId - User ID
   * @param {string} params.role - User role (admin/hr/employee)
   * @returns {Promise<Object>} - API response with answer, steps, and sources
   */
  sendQuery: async ({ question, userId, role }) => {
    // Mock mode for testing without backend
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        answer: `**Mock Response**\n\nThis is a mock response to: "${question}"\n\n- Point 1\n- Point 2\n- Point 3`,
        steps: ["load_memory", "plan:KB_SEARCH", "retrieve", "generate"],
        context_sources: ["mock_doc.pdf"],
      };
    }

    // ✅ Real API call matching your backend
    const response = await apiClient.post(endpoints.chat.query, {
      question,
      user_id: userId,
      role,
    });

    return response.data;
  },
};
