import { Sparkles, Pencil, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DashboardActions({ onEditProfile, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-48 flex-shrink-0">
      {/* AI Resume Generator */}
      <button
        onClick={() => navigate("/candidate/resume-generator")}
        className="
          inline-flex items-center justify-center gap-2
          w-full
          px-4 py-2.5
          rounded-lg
          bg-primary/10
          text-primary
          text-sm font-semibold
        hover:bg-primary/20
          cursor-pointer
          transition-colors
        "
      >
        <Sparkles size={16} />
        AI Resume Generator
      </button>

      {/* Edit Profile */}
      <button
        onClick={onEditProfile}
        className="
          inline-flex items-center justify-center gap-2
          w-full
          px-4 py-2.5
          rounded-lg
          border border-border
          text-text
          text-sm font-semibold
          hover:border-primary
          hover:text-primary
          transition-colors
        "
      >
        <Pencil size={16} />
        Edit Profile
      </button>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="
          inline-flex items-center justify-center gap-2
          w-full
          px-4 py-2.5
          rounded-lg
          border border-danger/20
          text-danger
          text-sm font-semibold
          hover:bg-danger/5
          transition-colors
        "
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}

export default DashboardActions;
