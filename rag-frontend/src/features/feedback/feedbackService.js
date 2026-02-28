import apiClient from "../../services/apiClient";
import { endpoints } from "../../services/endpoints";

/**
 * Feedback service - handles feedback submission and retrieval
 */
export const feedbackService = {
  /**
   * Submit feedback for a response
   * @param {Object} feedback - Feedback data
   * @param {string} feedback.userId - User ID
   * @param {string} feedback.questionId - Question/response ID
   * @param {number} feedback.rating - Rating (1-5)
   * @param {string} feedback.comment - Optional comment
   * @returns {Promise<Object>} - Submission result
   */
  submitFeedback: async ({ userId, questionId, rating, comment }) => {
    const response = await apiClient.post(endpoints.feedback.submit, {
      user_id: userId,
      question_id: questionId,
      rating,
      comment,
    });
    return response.data;
  },

  /**
   * Get feedback list (admin only)
   * @returns {Promise<Array>} - Array of feedback entries
   */
  getFeedbackList: async () => {
    const response = await apiClient.get(endpoints.feedback.list);
    return response.data;
  },
};
