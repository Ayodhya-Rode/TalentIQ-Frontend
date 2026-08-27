import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrganization } from "../../services/orgAdminService";
import { useAuth } from "../../context/AuthContext";
import { Building2, LogOut, ChevronRight, Briefcase, Users, ArrowLeft } from "lucide-react";

const statusStyles = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  SUSPENDED: "bg-danger/10 text-danger",
};

function OrgAdminHome() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await getMyOrganization();
        setOrg(res.data.data);
      } catch {
        setOrg(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-danger/20 text-danger hover:bg-danger/5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {loading && <p className="text-text-muted text-sm">Loading...</p>}

        {!loading && (
          <div className="grid gap-3">
            {/* Organization card — always clickable */}
            <button
              onClick={() => navigate("/org-admin/organization")}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {org?.logo ? (
                    <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={20} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{org ? org.name : "Organization"}</p>
                  <p className="text-xs text-text-muted truncate">
                    {org ? "View and manage your organization" : "Register your organization to get started"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {org && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[org.status] || "bg-text-muted/10 text-text-muted"}`}>
                    {org.status}
                  </span>
                )}
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            </button>

            {/* Placeholder sections for future features */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-surface/50 p-5 opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-text-muted/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} className="text-text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">Job Postings</p>
                  <p className="text-xs text-text-muted truncate">Coming soon</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-surface/50 p-5 opacity-60 cursor-not-allowed">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-text-muted/10 flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">Recruiters & Candidates</p>
                  <p className="text-xs text-text-muted truncate">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrgAdminHome;