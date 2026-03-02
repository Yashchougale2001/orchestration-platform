/**
 * API endpoint definitions
 */
export const endpoints = {
  // Chat/Query endpoints
  chat: {
    query: "/query",
  },

  // Ingestion endpoints
  ingestion: {
    file: "/ingest/file",
    folder: "/ingest/folder",
    url: "/ingest/url",
  },

  // Feedback endpoints
  feedback: {
    submit: "/feedback",
  },

  // Admin endpoints
  admin: {
    stats: "/admin/stats",
    topSources: "/admin/top-sources",
    logs: "/admin/logs",
    activeUsers: "/admin/active-users",
    feedbackSummary: "/admin/feedback-summary",
    queryLogs: "/admin/query-logs",
  },

  // Health check
  health: "/health",
};
