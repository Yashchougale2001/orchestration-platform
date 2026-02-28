import React, { createContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import { TOAST_TYPES } from "../utils/constants";

/**
 * Toast Context - provides toast notification functionality
 */
export const ToastContext = createContext({
  showToast: () => {},
});

export const ToastContextProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: TOAST_TYPES.INFO,
  });

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, warning, info)
   */
  const showToast = useCallback((message, type = TOAST_TYPES.INFO) => {
    setToast({
      open: true,
      message,
      type,
    });
  }, []);

  // Close toast handler
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
