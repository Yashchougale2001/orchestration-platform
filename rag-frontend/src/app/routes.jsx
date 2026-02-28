import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { ChatPage } from "../pages/ChatPage";
import { IngestionPage } from "../pages/IngestionPage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { AdminDashboard } from "../pages/AdminDashboard";
import { ROLES } from "../utils/constants";

/**
 * Application routes configuration
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE]}
          >
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to chat */}
        <Route index element={<Navigate to="/chat" replace />} />

        {/* Chat - accessible to all authenticated users */}
        <Route path="chat" element={<ChatPage />} />

        {/* Ingestion - accessible to admin and HR */}
        <Route
          path="ingestion"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}>
              <IngestionPage />
            </ProtectedRoute>
          }
        />

        {/* Feedback - accessible to all authenticated users */}
        <Route path="feedback" element={<FeedbackPage />} />

        {/* Admin Dashboard - accessible to admin only */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all - redirect to chat */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
