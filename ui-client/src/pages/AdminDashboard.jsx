import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import StorageIcon from "@mui/icons-material/Storage";
import PeopleIcon from "@mui/icons-material/People";
import SpeedIcon from "@mui/icons-material/Speed";
import { Card } from "../components/ui/Card";
import { adminService } from "../features/admin/adminService";

/**
 * Admin dashboard with system statistics and logs
 * Only accessible to admin users
 */
export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  // Load mocked data on mount
  useEffect(() => {
    setStats(adminService.getMockedStats());
    setLogs(adminService.getMockedLogs());
  }, []);

  // Stat card data
  const statCards = [
    {
      title: "Total Queries",
      value: stats?.totalQueries || 0,
      icon: <QueryStatsIcon />,
      color: "#6366f1",
    },
    {
      title: "Documents Ingested",
      value: stats?.totalIngestions || 0,
      icon: <StorageIcon />,
      color: "#10b981",
    },
    {
      title: "Active Users",
      value: stats?.totalUsers || 0,
      icon: <PeopleIcon />,
      color: "#f59e0b",
    },
    {
      title: "Avg Response Time",
      value: stats?.avgResponseTime || "0s",
      icon: <SpeedIcon />,
      color: "#ef4444",
    },
  ];

  /**
   * Get color for log level
   */
  const getLogLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return "error";
      case "WARNING":
        return "warning";
      case "INFO":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        System overview and analytics
      </Typography>

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
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Top Sources */}
        <Grid item xs={12} md={4}>
          <Card title="Top Sources">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {stats?.topSources?.map((source, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" noWrap sx={{ maxWidth: "70%" }}>
                    {source.name}
                  </Typography>
                  <Chip label={source.count} size="small" />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* System Logs */}
        <Grid item xs={12} md={8}>
          <Card title="Recent System Logs">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>User</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(log.timestamp).toLocaleTimeString()}
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
                          noWrap
                          sx={{ maxWidth: 300 }}
                        >
                          {log.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {log.user}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
