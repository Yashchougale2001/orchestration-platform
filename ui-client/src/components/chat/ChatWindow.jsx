import React, { useRef, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { ChatMessage } from "./ChatMessage";
import { EmptyState } from "../common/EmptyState";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

/**
 * Chat window component that displays messages
 * Auto-scrolls to latest message
 */
export const ChatWindow = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show empty state if no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <EmptyState
          icon={<ChatBubbleOutlineIcon sx={{ fontSize: 64 }} />}
          title="Start a conversation"
          description="Ask questions about HR policies, IT assets, or any other knowledge base topics."
        />
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Render messages */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* Loading skeleton */}
      {isLoading && (
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ mr: 1.5 }}
          />
          <Box sx={{ flex: 1, maxWidth: "70%" }}>
            <Skeleton variant="rounded" height={60} sx={{ borderRadius: 2 }} />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Skeleton variant="rounded" width={60} height={20} />
              <Skeleton variant="rounded" width={80} height={20} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </Box>
  );
};
