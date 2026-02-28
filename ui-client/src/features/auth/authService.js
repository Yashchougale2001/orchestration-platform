import { STORAGE_KEYS } from "../../utils/constants";

/**
 * Auth service - handles authentication (mocked for now)
 * In production, replace with actual auth API calls
 */

/**
 * Login user (mocked)
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.userId - User ID
 * @param {string} credentials.role - User role
 * @returns {Promise<Object>} - User object
 */
const login = async ({ userId, role }) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = {
    id: userId,
    role,
    name: `User ${userId}`,
    email: `${userId}@company.com`,
  };

  // Store user in local storage
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  return user;
};

/**
 * Logout user
 */
const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get current user from storage
 * @returns {Object|null} - User object or null
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from storage:", error);
    return null;
  }
};

// Export as named object
export const authService = {
  login,
  logout,
  getCurrentUser,
};
