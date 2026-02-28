import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "../context/ThemeContext";
import { ToastContextProvider } from "../context/ToastContext";
import { AuthContextProvider } from "../features/auth/authContext";
import { ErrorBoundary } from "../components/common/ErrorBoundary";

/**
 * Application providers wrapper
 * Order matters: Theme -> Toast -> Auth
 */
export const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeContextProvider>
          <ToastContextProvider>
            <AuthContextProvider>{children}</AuthContextProvider>
          </ToastContextProvider>
        </ThemeContextProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};
