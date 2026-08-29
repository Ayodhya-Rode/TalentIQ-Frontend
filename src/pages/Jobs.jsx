import { useState, useEffect } from "react";
import { getApprovedJobs } from "../services/jobService";
import { Briefcase, MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { applyToJob, getMyApplications } from "../services/applicationService";
import { useAuth } from "../context/AuthContext";
import ApplyModal from "../components/ApplyModal";

const typeLabel = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingJob, setApplyingJob] = useState(null);

  useEffect(() => {
    getApprovedJobs()
      .then((res) => setJobs(res.data.data))
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));

    if (user?.role === "CANDIDATE") {
      getMyApplications()
        .then((res) =>
          setAppliedJobIds(new Set(res.data.data.map((a) => a.jobId))),
        )
        .catch(() => {});
    }
  }, [user]);

  const handleApplySubmit = async (data) => {
    await applyToJob(applyingJob.id, data);
    setAppliedJobIds((prev) => new Set(prev).add(applyingJob.id));
    setApplyingJob(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-semibold mb-1">
          Open positions
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Browse current openings across companies hiring on TalentIQ.
        </p>

        {loading && <p className="text-text-muted text-sm">Loading jobs...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {!loading && jobs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Briefcase size={28} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-muted text-sm">
              No open positions right now. Check back soon.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.organization?.logo ? (
                    <img
                      src={job.organization.logo}
                      alt={job.organization.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={18} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-text-muted">
                    {job.organization?.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted mb-3">
                <span className="inline-flex items-center gap-1">
                  <Briefcase size={12} />
                  {typeLabel[job.employmentType]}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {job.location || "Not specified"}
                  {job.isRemote && " · Remote-friendly"}
                </span>
              </div>

              <p className="text-sm text-text-muted line-clamp-2">
                {job.description}
              </p>

              {(!user || user.role === "CANDIDATE") && (
                <div className="mt-3">
                  {appliedJobIds.has(job.id) ? (
                    <span className="inline-block text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-md">
                      Applied ✓
                    </span>
                  ) : user ? (
                    <button
                      onClick={() => setApplyingJob(job)}
                      className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-block text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                      Log in to apply
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onSubmit={handleApplySubmit}
          onClose={() => setApplyingJob(null)}
        />
      )}
    </div>
  );
}

export default Jobs;
