// pages/candidate/Dashboard.jsx
import { useAuth } from "../../context/AuthContext";
import { useNavigate,Link } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between">
        <span className="font-display font-semibold text-lg">TalentIQ</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-danger hover:underline"
          >
            Logout
          </button>
          <Link to="/candidate/profile" className="text-primary hover:underline">Edit profile</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-text-muted">Your profile and applications will show up here.</p>
      </main>
    </div>
  );
}

export default Dashboard;