import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import AttachFileIcon from "@mui/icons-material/AttachFile";

/**
 * Chat input component with send button
 * Supports multi-line input and keyboard shortcuts
 */
export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Handle message submission
   */
  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage("");
    }
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "flex-end",
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "background.paper",
      }}
    >
      {/* Attachment button (placeholder) */}
      <Tooltip title="Attach file">
        <IconButton size="small" sx={{ mb: 0.5 }}>
          <AttachFileIcon />
        </IconButton>
      </Tooltip>

      {/* Text input */}
      <InputBase
        inputRef={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        multiline
        maxRows={4}
        sx={{
          flex: 1,
          mx: 1,
          py: 1,
          "& textarea": {
            overflow: "auto !important",
          },
        }}
      />

      {/* Voice input button (placeholder) */}
      <Tooltip title="Voice input">
        <IconButton size="small" sx={{ mb: 0.5 }}>
          <MicIcon />
        </IconButton>
      </Tooltip>

      {/* Send button */}
      <Tooltip title="Send message (Enter)">
        <span>
          <IconButton
            color="primary"
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            sx={{
              mb: 0.5,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
              "&:disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Paper>
  );
};
