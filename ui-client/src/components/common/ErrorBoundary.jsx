import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * Error boundary component
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("=== ERROR BOUNDARY CAUGHT ERROR ===");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo?.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/login";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 4,
            textAlign: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: "#d32f2f", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
            An unexpected error occurred. Please try refreshing the page.
          </Typography>

          {/* Show error details in development */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#ffebee",
                borderRadius: 1,
                maxWidth: 600,
                overflow: "auto",
                textAlign: "left",
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </Typography>
            </Box>
          )}

          <Button variant="contained" onClick={this.handleReset} sx={{ mt: 3 }}>
            Go to Login
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
