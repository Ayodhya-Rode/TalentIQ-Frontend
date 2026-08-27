import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrganizations } from "../../services/superAdminService";
import { useAuth } from "../../context/AuthContext";
import { Building2, LogOut, Sun, Moon, Search } from "lucide-react";

const statusStyles = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  SUSPENDED: "bg-danger/10 text-danger",
};

const STATUS_TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

function SuperAdminDashboard({ dark, setDark }) {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getAllOrganizations();
        setOrgs(res.data.data);
      } catch (err) {
        setError("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const pendingCount = useMemo(
    () => orgs.filter((o) => o.status === "PENDING").length,
    [orgs]
  );

  const filteredOrgs = useMemo(() => {
    return orgs.filter((org) => {
      const matchesTab = activeTab === "ALL" || org.status === activeTab;
      const matchesSearch = org.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orgs, activeTab, search]);

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold">
              Organizations
            </h1>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold bg-warning/10 text-warning px-2.5 py-1 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((prev) => !prev)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
              title="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-danger/20 text-danger hover:bg-danger/5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text-muted hover:text-text"
              }`}
            >
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading && <p className="text-text-muted text-sm">Loading...</p>}
        {error && <p className="text-danger text-sm">{error}</p>}

        {!loading && !error && filteredOrgs.length === 0 && (
          <p className="text-text-muted text-sm">No organizations match.</p>
        )}

        <div className="flex flex-col gap-3">
          {filteredOrgs.map((org) => (
            <button
              key={org.id}
              onClick={() =>
                navigate(`/super-admin/organizations/${org.id}`, {
                  state: { org },
                })
              }
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {org.logo ? (
                    <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={18} className="text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text truncate">{org.name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {org.industry} · {org.admin?.email}
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;