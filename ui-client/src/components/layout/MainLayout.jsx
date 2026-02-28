import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

const DRAWER_WIDTH = 260;
const DRAWER_WIDTH_COLLAPSED = 72;

/**
 * Main layout component with collapsible sidebar
 * Desktop: Sidebar collapses to icons only
 * Mobile: Sidebar is hidden/overlay
 */
export const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={DRAWER_WIDTH_COLLAPSED}
        isMobile={isMobile}
      />

      {/* Main content area - NO margin, flexbox handles spacing */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Top navbar */}
        <Navbar
          onMenuClick={toggleSidebar}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />

        {/* Page content */}
        <Box
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
