import React from "react";
import { Alert, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Toast notification component (standalone version)
 */
export const Toast = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 5000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
