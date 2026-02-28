import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

/**
 * Component to display source documents used in the response
 */
export const SourceList = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 0.5, display: "block" }}
      >
        Sources:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {sources.map((source, index) => (
          <Chip
            key={index}
            icon={<DescriptionIcon />}
            label={source}
            size="small"
            variant="outlined"
            sx={{
              fontSize: "0.75rem",
              height: 24,
              "& .MuiChip-icon": {
                fontSize: "0.875rem",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
