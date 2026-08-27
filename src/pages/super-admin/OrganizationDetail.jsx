import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getOrganizationById,
  approveOrganization,
  rejectOrganization,
  suspendOrganization,
  activateOrganization,
} from "../../services/superAdminService";
import { ArrowLeft, Building2 } from "lucide-react";

const statusStyles = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  SUSPENDED: "bg-danger/10 text-danger",
};

function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionStatus, setActionStatus] = useState("idle"); // idle | loading | error

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await getOrganizationById(id);
        setOrg(res.data.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Organization not found"
            : "Failed to load organization"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [id]);

  const runAction = async (actionFn) => {
    setActionStatus("loading");
    try {
      const res = await actionFn(id);
      setOrg(res.data.data);
      setActionStatus("idle");
    } catch (err) {
      setActionStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-3">
        <p className="text-danger text-sm">{error || "Organization not found"}</p>
        <Link to="/super-admin/dashboard" className="text-primary hover:underline text-sm">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/super-admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-6"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 size={22} className="text-primary" />
              )}
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold">{org.name}</h1>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  statusStyles[org.status] || "bg-text-muted/10 text-text-muted"
                }`}
              >
                {org.status}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <dt className="text-text-muted text-xs mb-1">Industry</dt>
              <dd className="text-text font-medium">{org.industry}</dd>
            </div>
            <div>
              <dt className="text-text-muted text-xs mb-1">Admin email</dt>
              <dd className="text-text font-medium">{org.admin?.email}</dd>
            </div>
            <div>
              <dt className="text-text-muted text-xs mb-1">Registered on</dt>
              <dd className="text-text font-medium">
                {new Date(org.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>

          {actionStatus === "error" && (
            <p className="text-danger text-sm mb-4">Action failed. Try again.</p>
          )}

          <div className="flex flex-wrap gap-3">
            {org.status === "PENDING" && (
              <>
                <button
                  onClick={() => runAction(approveOrganization)}
                  disabled={actionStatus === "loading"}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => runAction(rejectOrganization)}
                  disabled={actionStatus === "loading"}
                  className="border border-danger/20 text-danger hover:bg-danger/5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}

            {org.status === "APPROVED" && (
              <button
                onClick={() => runAction(suspendOrganization)}
                disabled={actionStatus === "loading"}
                className="border border-danger/20 text-danger hover:bg-danger/5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                Suspend
              </button>
            )}

            {(org.status === "SUSPENDED" || org.status === "REJECTED") && (
              <button
                onClick={() => runAction(activateOrganization)}
                disabled={actionStatus === "loading"}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetail;