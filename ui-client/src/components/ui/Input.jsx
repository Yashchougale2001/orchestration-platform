import React from "react";
import { TextField } from "@mui/material";

/**
 * Reusable Input component
 */
export const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error = false,
  helperText = "",
  fullWidth = true,
  multiline = false,
  rows = 1,
  disabled = false,
  required = false,
  autoFocus = false,
  InputProps = {},
  sx = {},
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      InputProps={InputProps}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
        ...sx,
      }}
      {...props}
    />
  );
};
