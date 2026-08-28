import { useState } from "react";
import { useEffect } from "react";
import { getPendingJobs, approveJob, rejectJob } from "../services/jobService";
import { CheckCircle2, XCircle, Briefcase } from "lucide-react";

function PendingJobsQueue() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getPendingJobs();
      setJobs(res.data.data);
    } catch {
      setError("Failed to load pending jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (job) => {
    setActioningId(job.id);
    try {
      await approveJob(job.id);
      fetchJobs();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to approve");
    } finally {
      setActioningId(null);
    }
  };

  const openReject = (job) => {
    setRejectingId(job.id);
    setRejectReason("");
  };

  const confirmReject = async (job) => {
    setActioningId(job.id);
    try {
      await rejectJob(job.id, rejectReason);
      setRejectingId(null);
      fetchJobs();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reject");
    } finally {
      setActioningId(null);
    }
  };

  if (loading)
    return <p className="text-text-muted text-sm">Loading pending jobs...</p>;
  if (error) return <p className="text-danger text-sm">{error}</p>;

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Briefcase size={20} className="mx-auto mb-2 text-text-muted" />
        <p className="text-text-muted text-sm">No jobs pending approval.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} className="border border-border rounded-lg p-4">
          <div className="mb-3">
            <p className="font-semibold text-sm mb-1">{job.title}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted mb-2">
              <span>{job.department || "No department"}</span>
              <span>·</span>
              <span>{job.employmentType.replace("_", " ")}</span>
              <span>·</span>
              <span>
                {job.location || "No location"}
                {job.isRemote && " (Remote-friendly)"}
              </span>
            </div>
            <p className="text-xs text-text-muted mb-2">
              Posted by {job.recruiter?.email}
            </p>
            <p className="text-sm whitespace-pre-wrap">{job.description}</p>
          </div>

          <p className="text-sm text-text-muted mb-3 line-clamp-3">
            {job.description}
          </p>

          {job.previousSnapshot && (
            <div className="mb-3 bg-warning/5 border border-warning/20 rounded-md p-3 text-xs">
              <p className="font-semibold text-warning mb-1">
                This was a live job — showing previous vs new
              </p>
              <p className="text-text-muted">
                Previous title: {job.previousSnapshot.title}
              </p>
              <p className="text-text-muted">
                Previous description: {job.previousSnapshot.description}
              </p>
            </div>
          )}

          {rejectingId === job.id ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="Reason for rejection (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => confirmReject(job)}
                  disabled={actioningId === job.id}
                  className="text-xs bg-danger text-white px-3 py-1.5 rounded-md disabled:opacity-50"
                >
                  Confirm reject
                </button>
                <button
                  onClick={() => setRejectingId(null)}
                  className="text-xs border border-border px-3 py-1.5 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(job)}
                disabled={actioningId === job.id}
                className="inline-flex items-center gap-1 text-xs bg-success text-white px-3 py-1.5 rounded-md disabled:opacity-50"
              >
                <CheckCircle2 size={13} />
                Approve
              </button>
              <button
                onClick={() => openReject(job)}
                disabled={actioningId === job.id}
                className="inline-flex items-center gap-1 text-xs border border-danger/20 text-danger px-3 py-1.5 rounded-md disabled:opacity-50"
              >
                <XCircle size={13} />
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PendingJobsQueue;
