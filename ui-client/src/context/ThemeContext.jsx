import React, { createContext, useState, useEffect, useMemo } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { STORAGE_KEYS } from "../utils/constants";
import { appConfig } from "../config/appConfig";

/**
 * Theme Context - manages application theme (light/dark mode)
 */
export const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
  primaryColor: appConfig.theme.primaryColor,
  setPrimaryColor: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || "light";
  });

  const [primaryColor, setPrimaryColor] = useState(
    appConfig.theme.primaryColor,
  );

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Create MUI theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: primaryColor,
          },
          secondary: {
            main: appConfig.theme.secondaryColor,
          },
          background: {
            default: mode === "light" ? "#f8fafc" : "#0f172a",
            paper: mode === "light" ? "#ffffff" : "#1e293b",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 600 },
          h2: { fontWeight: 600 },
          h3: { fontWeight: 600 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(0,0,0,0.1)"
                    : "0 1px 3px rgba(0,0,0,0.3)",
              },
            },
          },
        },
      }),
    [mode, primaryColor],
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      primaryColor,
      setPrimaryColor,
    }),
    [mode, primaryColor],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
