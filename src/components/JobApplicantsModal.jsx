import { useState, useEffect } from "react";
import {
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/applicationService";
import { X, FileText } from "lucide-react";
import ResumeViewerModal from "./ResumeViewerModal";

const statusStyles = {
  APPLIED: "bg-warning/10 text-warning",
  UNDER_REVIEW: "bg-primary/10 text-primary",
  SHORTLISTED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
};

const nextActions = {
  APPLIED: [{ status: "UNDER_REVIEW", label: "Move to review" }],
  UNDER_REVIEW: [
    { status: "SHORTLISTED", label: "Shortlist" },
    { status: "REJECTED", label: "Reject" },
  ],
  SHORTLISTED: [],
  REJECTED: [],
};

function JobApplicantsModal({ job, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [viewingResumeUrl, setViewingResumeUrl] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);

    try {
      const res = await getApplicationsForJob(job.id);
      setApplications(res.data.data);
      setError("");
    } catch {
      setError("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, status) => {
    setActioningId(appId);

    try {
      await updateApplicationStatus(appId, status);
      await fetchApplications();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update status");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted hover:text-text"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-1">Applicants</h2>

        <p className="text-text-muted text-sm mb-5">{job.title}</p>

        {/* Loading */}
        {loading && <p className="text-text-muted text-sm">Loading...</p>}

        {/* Error */}
        {error && <p className="text-danger text-sm mb-3">{error}</p>}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <p className="text-text-muted text-sm">No applicants yet.</p>
        )}

        {/* Applicants */}
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="border border-border rounded-lg p-4">
              {/* Candidate Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm">
                    {app.candidate?.candidateProfile?.fullName ||
                      app.candidate?.email}
                  </p>

                  <p className="text-xs text-text-muted">
                    {app.candidate?.email}
                  </p>

                  {app.candidate?.candidateProfile?.phone && (
                    <p className="text-xs text-text-muted">
                      {app.candidate.candidateProfile.phone}
                    </p>
                  )}
                </div>

                {/* Status */}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    statusStyles[app.status]
                  }`}
                >
                  {app.status.replace("_", " ")}
                </span>
              </div>

              {/* Skills */}
              {app.candidate?.candidateProfile?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {app.candidate.candidateProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Note */}
              {app.coverNote && (
                <p className="text-sm text-text-muted mb-2 italic">
                  "{app.coverNote}"
                </p>
              )}

              {/* Resume */}
              {app.candidate?.candidateProfile?.resumeUrl && (
                <button
                  onClick={() =>
                    setViewingResumeUrl(
                      app.candidate.candidateProfile.resumeUrl,
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3"
                >
                  <FileText size={12} />
                  View resume
                </button>
              )}

              {/* Status Actions */}
              {nextActions[app.status]?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {nextActions[app.status].map((action) => (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(app.id, action.status)}
                      disabled={actioningId === app.id}
                      className="text-xs border border-border px-3 py-1.5 rounded-md hover:bg-bg transition-colors disabled:opacity-50"
                    >
                      {actioningId === app.id ? "Updating..." : action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {viewingResumeUrl && (
        <ResumeViewerModal
          resumeUrl={viewingResumeUrl}
          onClose={() => setViewingResumeUrl(null)}
        />
      )}
    </div>
  );
}

export default JobApplicantsModal;
