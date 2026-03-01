// import { useState, useCallback } from "react";
// import { chatService } from "../features/chat/chatService";
// import { useAuth } from "./useAuth";
// import { MESSAGE_TYPES } from "../utils/constants";

// /**
//  * Custom hook for chat functionality
//  * Manages messages, loading state, and API calls
//  */
// export const useChat = () => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastResponse, setLastResponse] = useState(null);

//   /**
//    * Send a message to the RAG system
//    * @param {string} question - User's question
//    */
//   const sendMessage = useCallback(
//     async (question) => {
//       if (!user) return;

//       // Add user message to chat
//       const userMessage = {
//         id: Date.now(),
//         type: MESSAGE_TYPES.USER,
//         content: question,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages((prev) => [...prev, userMessage]);
//       setIsLoading(true);

//       try {
//         // Call API
//         const response = await chatService.sendQuery({
//           question,
//           userId: user.id,
//           role: user.role,
//         });

//         // Add bot response to chat
//         const botMessage = {
//           id: Date.now() + 1,
//           type: MESSAGE_TYPES.BOT,
//           content: response.answer,
//           steps: response.steps || [],
//           sources: response.context_sources || [],
//           timestamp: new Date().toISOString(),
//         };

//         setMessages((prev) => [...prev, botMessage]);
//         setLastResponse(botMessage);

//         return response;
//       } catch (error) {
//         // Add error message
//         const errorMessage = {
//           id: Date.now() + 1,
//           type: MESSAGE_TYPES.SYSTEM,
//           content:
//             "Sorry, there was an error processing your request. Please try again.",
//           isError: true,
//           timestamp: new Date().toISOString(),
//         };

//         setMessages((prev) => [...prev, errorMessage]);
//         throw error;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [user],
//   );

//   /**
//    * Clear all messages
//    */
//   const clearMessages = useCallback(() => {
//     setMessages([]);
//     setLastResponse(null);
//   }, []);

//   return {
//     messages,
//     isLoading,
//     lastResponse,
//     sendMessage,
//     clearMessages,
//   };
// };
import { useState, useCallback } from "react";
import { chatService } from "../features/chat/chatService";
import { useAuth } from "./useAuth";
import { MESSAGE_TYPES } from "../utils/constants";

/**
 * Custom hook for chat functionality
 * Manages messages, loading state, and API calls
 */
export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  /**
   * Send a message to the RAG system
   * @param {string} question - User's question
   */
  const sendMessage = useCallback(
    async (question) => {
      if (!user) {
        console.error("No user logged in");
        return;
      }

      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        type: MESSAGE_TYPES.USER,
        content: question,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Call API
        const response = await chatService.sendQuery({
          question,
          userId: user.id,
          role: user.role,
        });

        // Add bot response to chat
        const botMessage = {
          id: Date.now() + 1,
          type: MESSAGE_TYPES.BOT,
          content: response.answer || "No answer received",
          steps: response.steps || [],
          sources: response.context_sources || [],
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setLastResponse(botMessage);

        return response;
      } catch (error) {
        console.error("Chat error:", error);

        // Determine error message
        let errorContent = "Sorry, there was an error processing your request.";

        if (error.response) {
          // Server responded with error
          if (error.response.status === 500) {
            errorContent =
              "Server error occurred. Please check if the backend is running correctly.";
          } else if (error.response.status === 422) {
            errorContent = "Invalid request. Please try again.";
          } else {
            errorContent = error.response.data?.detail || errorContent;
          }
        } else if (error.request) {
          // No response received
          errorContent =
            "Cannot connect to server. Please make sure the backend is running.";
        }

        // Add error message
        const errorMessage = {
          id: Date.now() + 1,
          type: MESSAGE_TYPES.SYSTEM,
          content: errorContent,
          isError: true,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastResponse(null);
  }, []);

  return {
    messages,
    isLoading,
    lastResponse,
    sendMessage,
    clearMessages,
  };
};
