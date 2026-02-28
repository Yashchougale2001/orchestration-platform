import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

/**
 * Toggleable component to show/hide agent reasoning steps
 */
export const AgentStepsToggle = ({ steps }) => {
  const [expanded, setExpanded] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Agent Steps ({steps.length})
        </Typography>
        <IconButton size="small" sx={{ p: 0.25, ml: 0.5 }}>
          {expanded ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <List dense sx={{ py: 0 }}>
          {steps.map((step, index) => (
            <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckCircleOutlineIcon
                  fontSize="small"
                  color="success"
                  sx={{ fontSize: "0.875rem" }}
                />
              </ListItemIcon>
              <ListItemText
                primary={step}
                primaryTypographyProps={{
                  variant: "caption",
                  color: "text.secondary",
                  fontFamily: "monospace",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};
