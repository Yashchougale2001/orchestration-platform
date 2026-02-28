import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

/**
 * Reusable Button component with loading state
 */
export const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  startIcon,
  endIcon,
  fullWidth = false,
  size = "medium",
  onClick,
  type = "button",
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      fullWidth={fullWidth}
      size={size}
      onClick={onClick}
      type={type}
      sx={{
        position: "relative",
        ...sx,
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: "absolute",
            color: "inherit",
          }}
        />
      )}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </span>
    </MuiButton>
  );
};
