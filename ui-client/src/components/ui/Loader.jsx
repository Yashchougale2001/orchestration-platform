import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Loading indicator component
 */
export const Loader = ({
  size = 40,
  message = "Loading...",
  fullScreen = false,
  overlay = false,
}) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen || overlay) {
    return (
      <Box
        sx={{
          position: fullScreen ? "fixed" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: overlay ? "rgba(255,255,255,0.8)" : "transparent",
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};
