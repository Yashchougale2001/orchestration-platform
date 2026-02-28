import { ROLES } from "./constants";

/**
 * Role-based permission utilities
 */

// Define permissions for each role
const rolePermissions = {
  [ROLES.ADMIN]: [
    "view_chat",
    "send_message",
    "ingest_files",
    "view_feedback",
    "submit_feedback",
    "view_admin",
    "view_logs",
    "manage_users",
  ],
  [ROLES.HR]: [
    "view_chat",
    "send_message",
    "ingest_files",
    "view_feedback",
    "submit_feedback",
  ],
  [ROLES.EMPLOYEE]: [
    "view_chat",
    "send_message",
    "view_feedback",
    "submit_feedback",
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if a role can access a specific route
 * @param {string} role - User role
 * @param {string[]} allowedRoles - Roles allowed to access the route
 * @returns {boolean}
 */
export const canAccessRoute = (role, allowedRoles) => {
  return allowedRoles.includes(role);
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {string[]}
 */
export const getPermissions = (role) => {
  return rolePermissions[role] || [];
};
