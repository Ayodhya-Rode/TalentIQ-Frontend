import { useState, useEffect } from "react";
import {
  setMyDomains,
  getMyAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
} from "../services/availabilityService";
import { Plus, Trash2 } from "lucide-react";

const DOMAINS = ["FULL_STACK", "DATA_SCIENCE", "DEVOPS", "JAVA_DEVELOPER", "AI_ENGINEER", "FRONTEND", "BACKEND"];
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function EmpAvailabilityManager() {
  const [domains, setDomains] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSlot, setNewSlot] = useState({ dayOfWeek: "MONDAY", startTime: "10:00", endTime: "13:00" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getMyAvailability();
      setDomains(res.data.data.domains || []);
      setSlots(res.data.data.availabilitySlots || []);
    } catch {
      setError("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDomain = (d) => {
    setDomains((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const saveDomains = async () => {
    try {
      await setMyDomains(domains);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save domains");
    }
  };

  const handleAddSlot = async () => {
    try {
      await addAvailabilitySlot(newSlot);
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await deleteAvailabilitySlot(id);
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove slot");
    }
  };

  if (loading) return <p className="text-text-muted text-sm">Loading availability...</p>;

  return (
    <div>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Your domains</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => toggleDomain(d)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                domains.includes(d)
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text-muted hover:bg-bg"
              }`}
            >
              {d.replace("_", " ")}
            </button>
          ))}
        </div>
        <button
          onClick={saveDomains}
          className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md"
        >
          Save domains
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">Weekly availability</h3>
        <div className="space-y-2 mb-3">
          {slots.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
              <span className="text-sm">{s.dayOfWeek} · {s.startTime} - {s.endTime}</span>
              <button onClick={() => handleDeleteSlot(s.id)} className="text-danger hover:bg-danger/5 p-1 rounded">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {slots.length === 0 && <p className="text-text-muted text-sm">No slots added yet.</p>}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={newSlot.dayOfWeek}
            onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
            className="px-2 py-1.5 rounded border border-border bg-bg text-text text-sm"
          >
            {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            className="px-2 py-1.5 rounded border border-border bg-bg text-text text-sm"
          />
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            className="px-2 py-1.5 rounded border border-border bg-bg text-text text-sm"
          />
          <button
            onClick={handleAddSlot}
            className="inline-flex items-center gap-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md"
          >
            <Plus size={13} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmpAvailabilityManager;