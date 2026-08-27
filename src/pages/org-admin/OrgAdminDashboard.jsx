import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyOrganization,
  registerOrganization,
  updateOrganization,
  deleteOrganization,
  inviteTeamMember
} from "../../services/orgAdminService";
import { useAuth } from "../../context/AuthContext";
import OrgFormModal from "../../components/OrgFormModal";
import {
  Building2,
  LogOut,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Calendar,
  Mail,
  Briefcase,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import TeamMemberFormModal from "../../components/TeamMemberFormModal";

const statusStyles = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  SUSPENDED: "bg-danger/10 text-danger",
};

function daysSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function OrgAdminDashboard() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [viewOpen, setViewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchOrg = async () => {
    setLoading(true);
    try {
      const res = await getMyOrganization();
      setOrg(res.data.data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setOrg(null);
      } else {
        setError("Failed to load organization");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openCreate = () => {
    setFormMode("create");
    setFormOpen(true);
  };

  const openEdit = () => {
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (formMode === "create") {
      await registerOrganization(formData);
    } else {
      await updateOrganization(formData);
    }
    setFormOpen(false);
    fetchOrg();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${org.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteOrganization();
      setOrg(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete organization");
    } finally {
      setDeleting(false);
    }
  };

  const handleInviteSubmit = async (data) => {
    await inviteTeamMember(data);
    setInviteOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/org-admin")}
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">Organization</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-danger/20 text-danger hover:bg-danger/5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {loading && <p className="text-text-muted text-sm">Loading...</p>}
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {!loading && !org && (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <Building2 size={32} className="mx-auto mb-3 text-text-muted" />
            <p className="font-semibold mb-1">No organization registered yet</p>
            <p className="text-text-muted text-sm mb-5">
              Register your organization to get started. It'll be reviewed by
              our team before you get full access.
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={16} />
              Register Organization
            </button>
          </div>
        )}

        {!loading && org && (
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={22} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-lg truncate">{org.name}</p>
                  <p className="text-sm text-text-muted truncate">
                    {org.industry}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                  statusStyles[org.status] || "bg-text-muted/10 text-text-muted"
                }`}
              >
                {org.status}
              </span>
            </div>

            {org.status === "PENDING" && (
              <p className="text-sm text-warning bg-warning/10 rounded-lg px-3 py-2 mb-6">
                Your organization is awaiting approval. Some features will
                unlock once approved.
              </p>
            )}
            {org.status === "REJECTED" && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2 mb-6">
                Your registration was rejected. Edit the details to resubmit, or
                delete and start over.
              </p>
            )}
            {org.status === "SUSPENDED" && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2 mb-6">
                Your organization access is suspended. Contact support for
                details.
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewOpen(true)}
                className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-bg transition-colors"
              >
                <Eye size={15} />
                View
              </button>
              <button
                onClick={openEdit}
                className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-bg transition-colors"
              >
                <Pencil size={15} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 border border-danger/20 text-danger px-3 py-2 rounded-lg text-sm font-medium hover:bg-danger/5 transition-colors disabled:opacity-50"
              >
                <Trash2 size={15} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>

            {org.status === "APPROVED" && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="rounded-lg border border-border p-3">
                    <CheckCircle2 size={16} className="text-success mb-2" />
                    <p className="text-xs text-text-muted">Status</p>
                    <p className="text-sm font-semibold">Approved</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <Calendar size={16} className="text-primary mb-2" />
                    <p className="text-xs text-text-muted">Registered</p>
                    <p className="text-sm font-semibold">
                      {daysSince(org.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <Briefcase size={16} className="text-primary mb-2" />
                    <p className="text-xs text-text-muted">Industry</p>
                    <p className="text-sm font-semibold truncate">
                      {org.industry}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <Mail size={16} className="text-primary mb-2" />
                    <p className="text-xs text-text-muted">Admin</p>
                    <p className="text-sm font-semibold truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInviteOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <UserPlus size={16} />
                  Invite Recruiter / Interviewer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {formOpen && (
        <OrgFormModal
          mode={formMode}
          initialData={formMode === "edit" ? org : null}
          onSubmit={handleFormSubmit}
          onClose={() => setFormOpen(false)}
        />
      )}

      {viewOpen && org && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setViewOpen(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-text"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Organization details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-muted">Name</p>
                <p className="font-medium">{org.name}</p>
              </div>
              <div>
                <p className="text-text-muted">Industry</p>
                <p className="font-medium">{org.industry}</p>
              </div>
              <div>
                <p className="text-text-muted">Status</p>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[org.status]}`}
                >
                  {org.status}
                </span>
              </div>
              <div>
                <p className="text-text-muted">Registered on</p>
                <p className="font-medium">
                  {new Date(org.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {inviteOpen && (
        <TeamMemberFormModal
          onSubmit={handleInviteSubmit}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
}

export default OrgAdminDashboard;
