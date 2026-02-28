import React from "react";
import { Box, Typography } from "@mui/material";
import { ChatWindow } from "../components/chat/ChatWindow";
import { ChatInput } from "../components/chat/ChatInput";
import { useChat } from "../hooks/useChat";
import { useToast } from "../hooks/useToast";

/**
 * Main chat page component
 * Displays chat interface with message history and input
 */
export const ChatPage = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const toast = useToast();

  /**
   * Handle sending a new message
   */
  const handleSend = async (question) => {
    try {
      await sendMessage(question);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Chat
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask questions about HR policies, IT assets, and more
        </Typography>
      </Box>

      {/* Chat window */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* Input area */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
          placeholder="Ask a question about HR policies or IT assets..."
        />
      </Box>
    </Box>
  );
};
