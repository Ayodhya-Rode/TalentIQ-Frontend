import { useState, useEffect } from "react";
import { getMyApplications } from "../../services/applicationService";
import { Briefcase, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const statusStyles = {
  APPLIED: "bg-warning/10 text-warning",
  UNDER_REVIEW: "bg-primary/10 text-primary",
  SHORTLISTED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
};

const statusLabel = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Not selected",
};

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data.data))
      .catch(() => setError("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/candidate/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-semibold mb-6">
          My Applications
        </h1>

        {loading && <p className="text-text-muted text-sm">Loading...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {!loading && applications.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <Briefcase size={28} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-muted text-sm">
              You haven't applied to any jobs yet.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {app.job?.organization?.logo ? (
                    <img
                      src={app.job.organization.logo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={16} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {app.job?.title}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {app.job?.organization?.name}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[app.status]}`}
              >
                {statusLabel[app.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
