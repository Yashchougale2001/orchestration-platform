import { useContext } from "react";
import { AuthContext } from "../features/auth/authContext";

/**
 * Custom hook for accessing auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
};
