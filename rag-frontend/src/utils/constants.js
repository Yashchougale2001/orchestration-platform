/**
 * Application-wide constants
 */

// User roles for RBAC
export const ROLES = {
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee",
};

// Role display labels
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.HR]: "HR Manager",
  [ROLES.EMPLOYEE]: "Employee",
};

// Navigation items configuration
export const NAV_ITEMS = [
  {
    path: "/chat",
    label: "Chat",
    icon: "Chat",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE],
  },
  {
    path: "/ingestion",
    label: "Ingestion",
    icon: "Upload",
    roles: [ROLES.ADMIN, ROLES.HR],
  },
  {
    path: "/feedback",
    label: "Feedback",
    icon: "Feedback",
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE],
  },
  {
    path: "/admin",
    label: "Admin Panel",
    icon: "AdminPanel",
    roles: [ROLES.ADMIN],
  },
];

// Message types for chat
export const MESSAGE_TYPES = {
  USER: "user",
  BOT: "bot",
  SYSTEM: "system",
};

// Toast notification types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "rag-theme",
  USER: "rag-user",
  AUTH_TOKEN: "rag-token",
};
