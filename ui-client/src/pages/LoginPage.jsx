import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { ROLES, ROLE_LABELS } from "../utils/constants";

/**
 * Login page component
 */
export const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState(ROLES.EMPLOYEE);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Get redirect path from state or default to chat
  const from = location.state?.from?.pathname || "/chat";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      toast.error("Please enter a User ID");
      return;
    }

    setIsLoading(true);

    try {
      await login({ userId: userId.trim(), role });
      toast.success("Login successful!");
      // Navigation will happen automatically via useEffect above
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        {/* Logo and title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <SmartToyIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>
            RAG Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to access the knowledge base
          </Typography>
        </Box>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* User ID input */}
            <Input
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              required
              autoFocus
            />

            {/* Role selector */}
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Submit button */}
            <Button type="submit" loading={isLoading} fullWidth size="large">
              Sign In
            </Button>
          </Box>
        </form>

        {/* Info text */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: 3 }}
        >
          Demo login: Enter any User ID and select your role.
        </Typography>
      </Paper>
    </Box>
  );
};
