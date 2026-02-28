import React from "react";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
} from "@mui/material";

/**
 * Reusable Card component
 */
export const Card = ({
  children,
  title,
  subheader,
  action,
  actions,
  elevation = 0,
  sx = {},
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        ...sx,
      }}
      {...props}
    >
      {(title || subheader || action) && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={action}
          sx={{
            "& .MuiCardHeader-title": {
              fontSize: "1.125rem",
              fontWeight: 600,
            },
          }}
        />
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};
