import React from "react";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

/**
 * Root application component
 * Combines providers and routes
 */
const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
