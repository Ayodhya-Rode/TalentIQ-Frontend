import { useState, useEffect } from "react";
import { getBookingsNeedingAttention, getFlaggedEmps } from "../services/bookingService";

function AdminBookingQueues() {
  const [needsAttention, setNeedsAttention] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookingsNeedingAttention(), getFlaggedEmps()])
      .then(([a, f]) => {
        setNeedsAttention(a.data.data);
        setFlagged(f.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-text-muted text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Bookings needing attention</h3>
        {needsAttention.length === 0 && <p className="text-text-muted text-sm">None right now.</p>}
        <div className="space-y-2">
          {needsAttention.map((b) => (
            <div key={b.id} className="border border-danger/20 bg-danger/5 rounded-lg px-4 py-3 text-sm">
              {b.domain.replace("_", " ")} · {b.candidate?.email} · {new Date(b.scheduledDate).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Flagged team members (3+ cancellations this month)</h3>
        {flagged.length === 0 && <p className="text-text-muted text-sm">None right now.</p>}
        <div className="space-y-2">
          {flagged.map((f) => (
            <div key={f.emp.id} className="border border-warning/20 bg-warning/5 rounded-lg px-4 py-3 text-sm">
              {f.emp.email} — {f.count} cancellations
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminBookingQueues;