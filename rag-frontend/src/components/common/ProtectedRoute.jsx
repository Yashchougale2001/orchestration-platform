import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../ui/Loader";
import { canAccessRoute } from "../../utils/rolePermissions";

/**
 * Protected route wrapper
 * Handles authentication and role-based access
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loader while checking auth
  if (isLoading) {
    return <Loader fullScreen message="Loading..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!canAccessRoute(user.role, allowedRoles)) {
      return <Navigate to="/chat" replace />;
    }
  }

  return <>{children}</>;
};
