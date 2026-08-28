import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyMembership } from "../../services/teamMemberService";
import { useAuth } from "../../context/AuthContext";
import { Building2, LogOut, Users } from "lucide-react";
import RecruiterJobsList from "../../components/RecruiterJobsList";

function RecruiterDashboard() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    getMyMembership()
      .then((res) => setOrg(res.data.data))
      .catch(() => setError("Failed to load organization"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
            <p className="text-text-muted text-sm">{user?.email}</p>
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
        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        {!loading && org && (
          <div className="rounded-xl border border-border bg-surface p-6 mb-6">
            <div className="flex items-center gap-4">
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
              <div>
                <p className="font-semibold text-lg">{org.name}</p>
                <p className="text-sm text-text-muted">
                  {org.industry} · Recruiter
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <RecruiterJobsList />

          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <Users size={22} className="mx-auto mb-2 text-text-muted" />
            <p className="font-semibold mb-1">Candidates & Interviews</p>
            <p className="text-text-muted text-sm">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
