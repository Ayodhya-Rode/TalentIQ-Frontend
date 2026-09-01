import { useState } from "react";
import { submitFeedback } from "../services/feedbackService";

function FeedbackForm({ bookingId, onSubmitted }) {
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!feedback.trim()) {
      setError("Feedback text is required");
      return;
    }
    setLoading(true);
    try {
      await submitFeedback(bookingId, { score, feedback });
      onSubmitted?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-display text-lg font-semibold text-text">Submit Feedback</h3>

      <div>
        <label className="text-sm text-text-muted">Score (1-10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-bg text-text"
        />
      </div>

      <div>
        <label className="text-sm text-text-muted">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="mt-1 w-full border border-border rounded-lg px-3 py-2 bg-bg text-text"
          placeholder="Communication, technical depth, areas to improve..."
        />
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

export default FeedbackForm;