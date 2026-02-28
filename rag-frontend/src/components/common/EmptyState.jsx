import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Empty state component for when there's no content to display
 */
export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        maxWidth: 400,
      }}
    >
      {icon && <Box sx={{ color: "text.secondary", mb: 2 }}>{icon}</Box>}
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};
