// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
// } from "@mui/material";
// import QueryStatsIcon from "@mui/icons-material/QueryStats";
// import StorageIcon from "@mui/icons-material/Storage";
// import PeopleIcon from "@mui/icons-material/People";
// import SpeedIcon from "@mui/icons-material/Speed";
// import { Card } from "../components/ui/Card";
// import { adminService } from "../features/admin/adminService";

// /**
//  * Admin dashboard with system statistics and logs
//  * Only accessible to admin users
//  */
// export const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [logs, setLogs] = useState([]);

//   // Load mocked data on mount
//   useEffect(() => {
//     setStats(adminService.getMockedStats());
//     setLogs(adminService.getMockedLogs());
//   }, []);

//   // Stat card data
//   const statCards = [
//     {
//       title: "Total Queries",
//       value: stats?.totalQueries || 0,
//       icon: <QueryStatsIcon />,
//       color: "#6366f1",
//     },
//     {
//       title: "Documents Ingested",
//       value: stats?.totalIngestions || 0,
//       icon: <StorageIcon />,
//       color: "#10b981",
//     },
//     {
//       title: "Active Users",
//       value: stats?.totalUsers || 0,
//       icon: <PeopleIcon />,
//       color: "#f59e0b",
//     },
//     {
//       title: "Avg Response Time",
//       value: stats?.avgResponseTime || "0s",
//       icon: <SpeedIcon />,
//       color: "#ef4444",
//     },
//   ];

//   /**
//    * Get color for log level
//    */
//   const getLogLevelColor = (level) => {
//     switch (level) {
//       case "ERROR":
//         return "error";
//       case "WARNING":
//         return "warning";
//       case "INFO":
//         return "info";
//       default:
//         return "default";
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Typography variant="h5" fontWeight={600} gutterBottom>
//         Admin Dashboard
//       </Typography>
//       <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//         System overview and analytics
//       </Typography>

//       {/* Stat Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {statCards.map((stat, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Paper
//               elevation={0}
//               sx={{
//                 p: 3,
//                 border: "1px solid",
//                 borderColor: "divider",
//                 borderRadius: 3,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 2,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: `${stat.color}20`,
//                   color: stat.color,
//                 }}
//               >
//                 {stat.icon}
//               </Box>
//               <Box>
//                 <Typography variant="h5" fontWeight={700}>
//                   {stat.value}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {stat.title}
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Content Grid */}
//       <Grid container spacing={3}>
//         {/* Top Sources */}
//         <Grid item xs={12} md={4}>
//           <Card title="Top Sources">
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//               {stats?.topSources?.map((source, index) => (
//                 <Box
//                   key={index}
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
//                     {source.name}
//                   </Typography>
//                   <Chip label={source.count} size="small" />
//                 </Box>
//               ))}
//             </Box>
//           </Card>
//         </Grid>

//         {/* System Logs */}
//         <Grid item xs={12} md={8}>
//           <Card title="Recent System Logs">
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Time</TableCell>
//                     <TableCell>Level</TableCell>
//                     <TableCell>Message</TableCell>
//                     <TableCell>User</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {logs.map((log) => (
//                     <TableRow key={log.id} hover>
//                       <TableCell>
//                         <Typography variant="caption">
//                           {new Date(log.timestamp).toLocaleTimeString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={log.level}
//                           size="small"
//                           color={getLogLevelColor(log.level)}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography
//                           variant="body2"
//                           noWrap
//                           sx={{ maxWidth: 300 }}
//                         >
//                           {log.message}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="caption" color="text.secondary">
//                           {log.user}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StorageIcon from "@mui/icons-material/Storage";
import PeopleIcon from "@mui/icons-material/People";
import SpeedIcon from "@mui/icons-material/Speed";
import TodayIcon from "@mui/icons-material/Today";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SearchIcon from "@mui/icons-material/Search";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { adminService } from "../features/admin/adminService";
import { useToast } from "../hooks/useToast";

/**
 * Admin dashboard with real system statistics and logs
 */
export const AdminDashboard = () => {
  // State
  const [stats, setStats] = useState(null);
  const [topSources, setTopSources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);
  const [feedbackSummary, setFeedbackSummary] = useState(null);

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // Filters
  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize] = useState(20);
  const [logLevel, setLogLevel] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // Error state
  const [error, setError] = useState(null);

  const toast = useToast();

  /**
   * Fetch system statistics
   */
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to load statistics");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  /**
   * Fetch top sources
   */
  const fetchTopSources = useCallback(async () => {
    try {
      const data = await adminService.getTopSources(10);
      setTopSources(data.sources || []);
    } catch (err) {
      console.error("Failed to fetch top sources:", err);
    }
  }, []);

  /**
   * Fetch system logs
   */
  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await adminService.getLogs({
        page: logsPage,
        pageSize: logsPageSize,
        level: logLevel || null,
        search: logSearch || null,
      });
      setLogs(data.logs || []);
      setLogsTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, [logsPage, logsPageSize, logLevel, logSearch]);

  /**
   * Fetch active users
   */
  const fetchActiveUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getActiveUsers();
      setActiveUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch active users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  /**
   * Fetch feedback summary
   */
  const fetchFeedbackSummary = useCallback(async () => {
    setLoadingFeedback(true);
    try {
      const data = await adminService.getFeedbackSummary();
      setFeedbackSummary(data);
    } catch (err) {
      console.error("Failed to fetch feedback summary:", err);
    } finally {
      setLoadingFeedback(false);
    }
  }, []);

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(() => {
    fetchStats();
    fetchTopSources();
    fetchLogs();
    fetchActiveUsers();
    fetchFeedbackSummary();
    toast.success("Dashboard refreshed");
  }, [
    fetchStats,
    fetchTopSources,
    fetchLogs,
    fetchActiveUsers,
    fetchFeedbackSummary,
    toast,
  ]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
    fetchTopSources();
    fetchActiveUsers();
    fetchFeedbackSummary();
  }, [fetchStats, fetchTopSources, fetchActiveUsers, fetchFeedbackSummary]);

  // Fetch logs when filters change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * Get color for log level
   */
  const getLogLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case "ERROR":
        return "error";
      case "WARNING":
        return "warning";
      case "INFO":
        return "info";
      case "DEBUG":
        return "default";
      default:
        return "default";
    }
  };

  /**
   * Format timestamp
   */
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  // Stat cards configuration
  const statCards = [
    {
      title: "Total Queries",
      value: stats?.total_queries || 0,
      subtitle: `${stats?.queries_today || 0} today`,
      icon: <QueryStatsIcon />,
      color: "#6366f1",
    },
    {
      title: "Documents",
      value: stats?.total_documents || 0,
      subtitle: `${stats?.total_chunks || 0} chunks`,
      icon: <StorageIcon />,
      color: "#10b981",
    },
    {
      title: "Active Users",
      value: stats?.active_users || 0,
      subtitle: "Unique users",
      icon: <PeopleIcon />,
      color: "#f59e0b",
    },
    {
      title: "Avg Response",
      value: stats?.avg_response_time || "N/A",
      subtitle: "Response time",
      icon: <SpeedIcon />,
      color: "#ef4444",
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            System overview and analytics
          </Typography>
        </Box>
        <Tooltip title="Refresh all data">
          <IconButton onClick={refreshAll} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loadingStats && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {loadingStats ? "..." : stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different sections */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
        >
          <Tab label="System Logs" />
          <Tab label="Active Users" />
          <Tab label="Top Sources" />
          <Tab label="Feedback" />
        </Tabs>

        {/* System Logs Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={logLevel}
                  label="Level"
                  onChange={(e) => {
                    setLogLevel(e.target.value);
                    setLogsPage(1);
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="INFO">INFO</MenuItem>
                  <MenuItem value="WARNING">WARNING</MenuItem>
                  <MenuItem value="ERROR">ERROR</MenuItem>
                  <MenuItem value="DEBUG">DEBUG</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => {
                  setLogSearch(e.target.value);
                  setLogsPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>

            {/* Logs Table */}
            {loadingLogs ? (
              <Loader message="Loading logs..." />
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={180}>Time</TableCell>
                        <TableCell width={100}>Level</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell width={120}>User</TableCell>
                        <TableCell width={120}>Module</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography color="text.secondary" sx={{ py: 4 }}>
                              No logs found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell>
                              <Typography
                                variant="caption"
                                fontFamily="monospace"
                              >
                                {formatTime(log.timestamp)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={log.level}
                                size="small"
                                color={getLogLevelColor(log.level)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 400,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={log.message}
                              >
                                {log.message}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {log.user}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {log.module || "-"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {logsTotal > logsPageSize && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Pagination
                      count={Math.ceil(logsTotal / logsPageSize)}
                      page={logsPage}
                      onChange={(e, page) => setLogsPage(page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {/* Active Users Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {loadingUsers ? (
              <Loader message="Loading users..." />
            ) : activeUsers.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No active users found
              </Typography>
            ) : (
              <List>
                {activeUsers.map((user, index) => (
                  <React.Fragment key={user.user_id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.user_id.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.user_id}
                        secondary={
                          <>
                            <Chip
                              label={user.role}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            {user.query_count} queries
                          </>
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last active: {formatTime(user.last_active)}
                      </Typography>
                    </ListItem>
                    {index < activeUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        )}

        {/* Top Sources Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            {topSources.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No source data available
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {topSources.map((source, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "70%" }}
                      >
                        {source.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {source.count} ({source.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={source.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Feedback Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            {loadingFeedback ? (
              <Loader message="Loading feedback..." />
            ) : !feedbackSummary ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No feedback data available
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Summary Stats */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} color="primary">
                      {feedbackSummary.average_rating.toFixed(1)}
                    </Typography>
                    <Rating
                      value={feedbackSummary.average_rating}
                      precision={0.1}
                      readOnly
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Average Rating ({feedbackSummary.total_feedback} reviews)
                    </Typography>
                  </Paper>
                </Grid>

                {/* Rating Distribution */}
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Rating Distribution
                    </Typography>
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count =
                        feedbackSummary.rating_distribution[rating] || 0;
                      const percentage =
                        feedbackSummary.total_feedback > 0
                          ? (count / feedbackSummary.total_feedback) * 100
                          : 0;

                      return (
                        <Box
                          key={rating}
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Typography variant="body2" sx={{ width: 20 }}>
                            {rating}
                          </Typography>
                          <Rating
                            value={rating}
                            size="small"
                            readOnly
                            sx={{ mx: 1 }}
                          />
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{ flex: 1, height: 8, borderRadius: 4, mx: 1 }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ width: 40 }}
                          >
                            {count}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Paper>
                </Grid>

                {/* Recent Feedback */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Feedback
                  </Typography>
                  {feedbackSummary.recent_feedback.length === 0 ? (
                    <Typography color="text.secondary">
                      No recent feedback
                    </Typography>
                  ) : (
                    <List>
                      {feedbackSummary.recent_feedback.map((fb, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "secondary.main" }}>
                                {fb.user_id?.charAt(0).toUpperCase() || "U"}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography variant="body2" fontWeight={600}>
                                    {fb.user_id}
                                  </Typography>
                                  <Rating
                                    value={fb.rating}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {fb.comment || "No comment"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {formatTime(fb.timestamp)}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          {index <
                            feedbackSummary.recent_feedback.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Paper>

      {/* Queries Chart Placeholder */}
      <Card title="Query Trends (Last 7 Days)" sx={{ mb: 3 }}>
        <Box
          sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 150 }}
        >
          {(stats?.queries_this_week || [0, 0, 0, 0, 0, 0, 0]).map(
            (count, index) => {
              const maxCount = Math.max(...(stats?.queries_this_week || [1]));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

              return (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {count}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: `${Math.max(height, 5)}%`,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                      minHeight: 4,
                      transition: "height 0.3s ease",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {days[index]}
                  </Typography>
                </Box>
              );
            },
          )}
        </Box>
      </Card>
    </Box>
  );
};
