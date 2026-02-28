import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

/**
 * Main layout component with sidebar and navbar
 * Handles responsive behavior for mobile/desktop
 */
export const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const drawerWidth = 260;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        width={drawerWidth}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: isMobile ? 0 : sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Top navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
