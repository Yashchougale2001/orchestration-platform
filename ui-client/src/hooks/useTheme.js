import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Custom hook for accessing theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }

  return context;
};
