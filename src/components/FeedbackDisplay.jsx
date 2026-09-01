import { useState, useEffect } from "react";
import { getFeedback } from "../services/feedbackService";

function FeedbackDisplay({ bookingId }) {
  const [feedback, setFeedback] = useState(null);
  const [notReady, setNotReady] = useState(false);

  useEffect(() => {
    getFeedback(bookingId)
      .then((res) => setFeedback(res.data.data))
      .catch(() => setNotReady(true));
  }, [bookingId]);

  if (notReady) return <p className="text-sm text-text-muted">Feedback not yet available.</p>;
  if (!feedback) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 mt-3">
      <p className="text-sm font-medium text-text">Score: {feedback.score}/10</p>
      <p className="text-sm text-text-muted mt-2">{feedback.feedback}</p>
    </div>
  );
}

export default FeedbackDisplay;