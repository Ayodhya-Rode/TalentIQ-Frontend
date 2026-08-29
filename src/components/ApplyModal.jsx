import { useState } from "react";
import { X } from "lucide-react";

function ApplyModal({ job, onSubmit, onClose }) {
  const [coverNote, setCoverNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ coverNote: coverNote || undefined });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to apply");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text">
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-1">Apply to {job.title}</h2>
        <p className="text-text-muted text-sm mb-4">{job.organization?.name}</p>

        {error && <p className="text-danger text-sm mb-3">{error}</p>}

        <label className="block text-sm mb-1">Cover note (optional)</label>
        <textarea
          rows={4}
          placeholder="Briefly say why you're a good fit..."
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          className="w-full px-3 py-2 rounded border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </div>
  );
}

export default ApplyModal;