import { useState, useEffect } from "react";
import api from "../services/api";
import { empCancelBooking } from "../services/bookingService";
import { XCircle } from "lucide-react";
import JoinButton from "./JoinButton";
import FeedbackForm from "./FeedbackForm";

function AssignedInterviews() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState(null);
  const [feedbackDoneIds, setFeedbackDoneIds] = useState([]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my-assigned");
      setBookings(res.data.data);
    } catch {
      setError("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Mark yourself unavailable for this interview?"))
      return;
    setCancelingId(id);
    try {
      await empCancelBooking(id);
      fetchBookings();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <p className="text-text-muted text-sm">Loading...</p>;

  return (
    <div>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {bookings.length === 0 && (
        <p className="text-text-muted text-sm">No assigned interviews.</p>
      )}
      <div className="space-y-2">
        {bookings.map((b) => (
          <div key={b.id} className="border border-border rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {b.domain.replace("_", " ")} interview
                </p>
                <p className="text-xs text-text-muted">
                  {new Date(b.scheduledDate).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleCancel(b.id)}
                disabled={cancelingId === b.id}
                className="inline-flex items-center gap-1 text-xs border border-danger/20 text-danger px-2.5 py-1.5 rounded-md hover:bg-danger/5 disabled:opacity-50 flex-shrink-0"
              >
                <XCircle size={12} />
                Can't make it
              </button>
            </div>

            {b.status === "ASSIGNED" && b.videoRoomUrl && (
              <JoinButton scheduledDate={b.scheduledDate} bookingId={b.id} />
            )}
            {b.status === "ASSIGNED" &&
              new Date(b.scheduledDate) < new Date() &&
              !feedbackDoneIds.includes(b.id) && (
                <FeedbackForm
                  bookingId={b.id}
                  onSubmitted={() =>
                    setFeedbackDoneIds((prev) => [...prev, b.id])
                  }
                />
              )}
            {feedbackDoneIds.includes(b.id) && (
              <p className="text-xs text-success mt-2">Feedback submitted.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignedInterviews;
