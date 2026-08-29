import { useState, useEffect } from "react";
import {
  getMyJobs,
  createJob,
  updateJob,
  closeJob,
} from "../services/jobService";
import JobFormModal from "./JobFormModal";
import { Plus, Pencil, XCircle, Briefcase, Users } from "lucide-react";
import JobApplicantsModal from "./JobApplicantsModal";

const statusStyles = {
  PENDING_APPROVAL: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  CLOSED: "bg-text-muted/10 text-text-muted",
};

const statusLabel = {
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Live",
  REJECTED: "Rejected",
  CLOSED: "Closed",
};

function RecruiterJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingJob, setEditingJob] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getMyJobs();
      setJobs(res.data.data);
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setFormMode("create");
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEdit = (job) => {
    setFormMode("edit");
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (formMode === "create") {
      await createJob(data);
    } else {
      await updateJob(editingJob.id, data);
    }
    setFormOpen(false);
    fetchJobs();
  };

  const handleClose = async (job) => {
    if (
      !window.confirm(
        `Close "${job.title}"? It'll no longer be visible to candidates.`,
      )
    )
      return;
    setClosingId(job.id);
    try {
      await closeJob(job.id);
      fetchJobs();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to close job");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Job Postings</h3>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
        >
          <Plus size={14} />
          Post a job
        </button>
      </div>

      {loading && <p className="text-text-muted text-sm">Loading jobs...</p>}
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      {!loading && jobs.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center">
          <Briefcase size={20} className="mx-auto mb-2 text-text-muted" />
          <p className="text-text-muted text-sm">No jobs posted yet.</p>
        </div>
      )}

      <div className="space-y-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border border-border rounded-lg px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{job.title}</p>
                <p className="text-xs text-text-muted">
                  {job.department} · {job.location || "No location"}{" "}
                  {job.isRemote && "· Remote"}
                </p>
                {job.status === "REJECTED" && job.rejectionReason && (
                  <p className="text-xs text-danger mt-1">
                    Reason: {job.rejectionReason}
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${statusStyles[job.status]}`}
              >
                {statusLabel[job.status]}
              </span>
            </div>

            {job.status !== "CLOSED" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(job)}
                  className="inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1.5 rounded-md hover:bg-bg transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleClose(job)}
                  disabled={closingId === job.id}
                  className="inline-flex items-center gap-1 text-xs border border-danger/20 text-danger px-2.5 py-1.5 rounded-md hover:bg-danger/5 transition-colors disabled:opacity-50"
                >
                  <XCircle size={12} />
                  {closingId === job.id ? "Closing..." : "Close"}
                </button>
              </div>
            )}
            <button
    onClick={() => setViewingApplicantsJob(job)}
    className="inline-flex items-center gap-1 text-xs border border-border px-2.5 py-1.5 rounded-md hover:bg-bg transition-colors"
  >
    <Users size={12} />
    Applicants
  </button>
          </div>
        ))}
      </div>

      {formOpen && (
        <JobFormModal
          mode={formMode}
          initialData={editingJob}
          onSubmit={handleFormSubmit}
          onClose={() => setFormOpen(false)}
        />
      )}
      {viewingApplicantsJob && (
        <JobApplicantsModal
          job={viewingApplicantsJob}
          onClose={() => setViewingApplicantsJob(null)}
        />
      )}
    </div>
  );
}

export default RecruiterJobsList;
