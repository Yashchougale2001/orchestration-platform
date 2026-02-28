import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import UploadIcon from "@mui/icons-material/Upload";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAuth } from "../../hooks/useAuth";
import { NAV_ITEMS, ROLE_LABELS } from "../../utils/constants";
import { canAccessRoute } from "../../utils/rolePermissions";

// Icon mapping for nav items
const iconMap = {
  Chat: ChatIcon,
  Upload: UploadIcon,
  Feedback: FeedbackIcon,
  AdminPanel: AdminPanelSettingsIcon,
};

/**
 * Sidebar navigation component
 * Shows navigation items based on user role
 */
export const Sidebar = ({ open, onClose, width, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Filter nav items based on user role
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccessRoute(user?.role, item.roles),
  );

  /**
   * Handle navigation item click
   */
  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        py: 2,
      }}
    >
      {/* Logo/Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 3,
          mb: 3,
        }}
      >
        <SmartToyIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
        <Typography variant="h6" fontWeight={700}>
          RAG Assistant
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 2 }}>
        {visibleNavItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* User info */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "action.hover",
          }}
        >
          <Avatar
            sx={{ width: 36, height: 36, mr: 1.5, bgcolor: "primary.main" }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {ROLE_LABELS[user?.role] || user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
