import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  rescheduleBooking,
  getAvailableSlots,
} from "../../services/bookingService";
import { ArrowLeft, Calendar } from "lucide-react";
import JoinButton from "../../components/JoinButton";

const statusStyles = {
  PENDING_PAYMENT: "bg-warning/10 text-warning",
  ASSIGNED: "bg-success/10 text-success",
  NEEDS_ATTENTION: "bg-danger/10 text-danger",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-text-muted/10 text-text-muted",
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reschedulingId, setReschedulingId] = useState(null);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/mine");
      setBookings(res.data.data);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openReschedule = async (b) => {
    setReschedulingId(b.id);
    try {
      const res = await getAvailableSlots(b.organizationId, b.domain);
      setRescheduleSlots(res.data.data);
    } catch {
      setError("Failed to load new slots");
    }
  };

  const handleReschedule = async (dateStr) => {
    try {
      await rescheduleBooking(reschedulingId, dateStr);
      setReschedulingId(null);
      fetchBookings();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reschedule");
    }
  };

  if (loading) return <p className="text-text-muted text-sm p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/candidate/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <h1 className="font-display text-2xl font-semibold mb-6">
          My mock interviews
        </h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {bookings.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Calendar size={28} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-muted text-sm">No bookings yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {b.domain.replace("_", " ")} · {b.organization?.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(b.scheduledDate).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[b.status]}`}
                >
                  {b.status.replace("_", " ")}
                </span>
              </div>

              {b.status === "ASSIGNED" && b.videoRoomUrl && (
                <JoinButton scheduledDate={b.scheduledDate} bookingId={b.id} />
              )}

              {b.status === "NEEDS_ATTENTION" && reschedulingId !== b.id && (
                <button
                  onClick={() => openReschedule(b)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Pick a new time
                </button>
              )}

              {reschedulingId === b.id && (
                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  {rescheduleSlots.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleReschedule(s)}
                      className="p-2 rounded border border-border hover:bg-primary/5 hover:border-primary text-xs text-left"
                    >
                      {new Date(s).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyBookings;