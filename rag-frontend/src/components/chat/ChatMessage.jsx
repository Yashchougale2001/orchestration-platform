import React from "react";
import { Box, Typography, Avatar, Paper, useTheme } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import ReactMarkdown from "react-markdown";
import { MESSAGE_TYPES } from "../../utils/constants";
import { SourceList } from "./SourceList";
import { AgentStepsToggle } from "./AgentStepsToggle";

/**
 * Individual chat message component
 * Supports user, bot, and system message types
 * Renders markdown content for bot messages
 */
export const ChatMessage = ({ message }) => {
  const theme = useTheme();
  const isUser = message.type === MESSAGE_TYPES.USER;
  const isBot = message.type === MESSAGE_TYPES.BOT;
  const isSystem = message.type === MESSAGE_TYPES.SYSTEM;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
        animation: "fadeIn 0.3s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Bot/System Avatar */}
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: isSystem ? "warning.main" : "primary.main",
            mr: 1.5,
            width: 36,
            height: 36,
          }}
        >
          <SmartToyIcon fontSize="small" />
        </Avatar>
      )}

      {/* Message Content */}
      <Box sx={{ maxWidth: "70%", minWidth: "200px" }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: isUser
              ? "primary.main"
              : message.isError
                ? "error.light"
                : theme.palette.mode === "light"
                  ? "grey.100"
                  : "grey.800",
            color: isUser ? "primary.contrastText" : "text.primary",
            borderRadius: 2,
            borderTopRightRadius: isUser ? 0 : 2,
            borderTopLeftRadius: isUser ? 2 : 0,
          }}
        >
          {/* Markdown rendering for bot messages */}
          {isBot ? (
            <Box
              sx={{
                "& p": { m: 0 },
                "& p + p": { mt: 1 },
                "& code": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                  px: 0.5,
                  borderRadius: 1,
                  fontFamily: "monospace",
                },
                "& pre": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                  p: 1,
                  borderRadius: 1,
                  overflow: "auto",
                },
                "& ul, & ol": { pl: 3, m: 0 },
              }}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Box>
          ) : (
            <Typography variant="body1">{message.content}</Typography>
          )}
        </Paper>

        {/* Sources - only for bot messages */}
        {isBot && message.sources && message.sources.length > 0 && (
          <SourceList sources={message.sources} />
        )}

        {/* Agent Steps - only for bot messages */}
        {isBot && message.steps && message.steps.length > 0 && (
          <AgentStepsToggle steps={message.steps} />
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.5,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>

      {/* User Avatar */}
      {isUser && (
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            ml: 1.5,
            width: 36,
            height: 36,
          }}
        >
          <PersonIcon fontSize="small" />
        </Avatar>
      )}
    </Box>
  );
};
