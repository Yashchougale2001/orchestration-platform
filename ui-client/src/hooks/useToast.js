import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { TOAST_TYPES } from "../utils/constants";

/**
 * Custom hook for toast notifications
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  const { showToast } = useContext(ToastContext);

  return {
    showToast,
    success: (message) => showToast(message, TOAST_TYPES.SUCCESS),
    error: (message) => showToast(message, TOAST_TYPES.ERROR),
    warning: (message) => showToast(message, TOAST_TYPES.WARNING),
    info: (message) => showToast(message, TOAST_TYPES.INFO),
  };
};
