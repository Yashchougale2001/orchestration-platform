// export const endpoints = {
//   auth: {
//     login: '/api/auth/login',
//     logout: '/api/auth/logout',
//     register: '/api/auth/register',
//   },
//   chat: {
//     sendMessage: '/api/chat/message',
//     getConversation: '/api/chat/conversation',
//   },
// };
/**
 * API endpoint definitions
 * Centralized endpoint management for easy maintenance
 */
export const endpoints = {
  // Chat endpoints
  chat: {
    query: "/query",
    history: "/chat/history",
  },

  // Ingestion endpoints
  ingestion: {
    file: "/ingest/file",
    folder: "/ingest/folder",
    url: "/ingest/url",
    status: "/ingest/status",
  },

  // Feedback endpoints
  feedback: {
    submit: "/feedback",
    list: "/feedback/list",
  },

  // Admin endpoints
  admin: {
    logs: "/admin/logs",
    stats: "/admin/stats",
    users: "/admin/users",
  },

  // Health check
  health: "/health",
};
