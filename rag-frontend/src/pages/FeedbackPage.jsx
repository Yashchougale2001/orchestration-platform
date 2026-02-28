import React, { useState } from "react";
import { Box, Typography, Rating, Paper, Divider } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { feedbackService } from "../features/feedback/feedbackService";
import { EmptyState } from "../components/common/EmptyState";
import FeedbackIcon from "@mui/icons-material/Feedback";

/**
 * Feedback page for rating and commenting on responses
 */
export const FeedbackPage = () => {
  const { lastResponse } = useChat();
  const { user } = useAuth();
  const toast = useToast();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Handle feedback submission
   */
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setIsLoading(true);

    try {
      await feedbackService.submitFeedback({
        userId: user.id,
        questionId: lastResponse?.id?.toString() || "unknown",
        rating,
        comment: comment.trim(),
      });

      toast.success("Feedback submitted successfully!");
      setSubmitted(true);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsLoading(false);
    }
  };

  // Show empty state if no response to rate
  if (!lastResponse) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 3,
        }}
      >
        <EmptyState
          icon={<FeedbackIcon sx={{ fontSize: 64 }} />}
          title="No response to rate"
          description="Start a conversation first, then come back to provide feedback on the responses."
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Provide Feedback
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us improve by rating the last response
      </Typography>

      {/* Last Response Preview */}
      <Card title="Last Response" sx={{ mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 2,
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          <Typography variant="body2">{lastResponse.content}</Typography>
        </Paper>

        {lastResponse.sources && lastResponse.sources.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Sources: {lastResponse.sources.join(", ")}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Feedback Form */}
      <Card title="Your Feedback">
        {submitted ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Thank you for your feedback!
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSubmitted(false)}
              sx={{ mt: 2 }}
            >
              Submit Another
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Rating */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                How helpful was this response?
              </Typography>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                size="large"
                emptyIcon={
                  <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                }
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {rating === 0 && "Select a rating"}
                {rating === 1 && "Not helpful"}
                {rating === 2 && "Slightly helpful"}
                {rating === 3 && "Moderately helpful"}
                {rating === 4 && "Very helpful"}
                {rating === 5 && "Extremely helpful"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Comment */}
            <Box sx={{ mb: 3 }}>
              <Input
                label="Additional Comments (Optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={4}
                placeholder="Tell us more about your experience..."
              />
            </Box>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              fullWidth
              size="large"
            >
              Submit Feedback
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};
