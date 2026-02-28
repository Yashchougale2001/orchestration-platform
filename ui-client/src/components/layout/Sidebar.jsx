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
  Tooltip,
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
 * Desktop: Collapsible (full width or icons only)
 * Mobile: Temporary overlay drawer
 */
export const Sidebar = ({
  open,
  mobileOpen,
  onClose,
  drawerWidth,
  collapsedWidth,
  isMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Filter nav items based on user role
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    canAccessRoute(user?.role, item.roles),
  );

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  // Current width based on open state
  const currentWidth = open ? drawerWidth : collapsedWidth;

  /**
   * Sidebar content - adapts based on collapsed state
   */
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        py: 2,
        overflow: "hidden",
      }}
    >
      {/* Logo/Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          px: open ? 3 : 0,
          mb: 3,
          minHeight: 40,
        }}
      >
        <Tooltip title={!open ? "RAG Assistant" : ""} placement="right">
          <SmartToyIcon
            color="primary"
            sx={{
              fontSize: 32,
              mr: open ? 1.5 : 0,
            }}
          />
        </Tooltip>
        {open && (
          <Typography
            variant="h6"
            fontWeight={700}
            noWrap
            sx={{
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            RAG Assistant
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: open ? 2 : 1 }}>
        {visibleNavItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={!open ? item.label : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 2 : 2.5,
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
                  <ListItemIcon
                    sx={{
                      minWidth: open ? 40 : 0,
                      justifyContent: "center",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* User info */}
      <Box sx={{ p: open ? 2 : 1 }}>
        <Tooltip
          title={
            !open
              ? `${user?.name || "User"} (${ROLE_LABELS[user?.role] || user?.role})`
              : ""
          }
          placement="right"
          arrow
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              p: open ? 1.5 : 1,
              borderRadius: 2,
              backgroundColor: "action.hover",
              cursor: "pointer",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                mr: open ? 1.5 : 0,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
            {open && (
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.name || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {ROLE_LABELS[user?.role] || user?.role}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );

  // Mobile: Temporary drawer (overlay)
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Always show full content on mobile */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            py: 2,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", px: 3, mb: 3 }}>
            <SmartToyIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography variant="h6" fontWeight={700}>
              RAG Assistant
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Nav Items */}
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
                        "&:hover": { backgroundColor: "primary.dark" },
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

          {/* User Info */}
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
      </Drawer>
    );
  }

  // Desktop: Persistent drawer with collapse animation
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        "& .MuiDrawer-paper": {
          width: currentWidth,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          overflowX: "hidden",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
