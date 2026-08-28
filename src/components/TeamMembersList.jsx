import { useState, useEffect } from "react";
import {
  getTeamMembers,
  deactivateTeamMember,
  activateTeamMember,
} from "../services/orgAdminService";
import { UserCheck, UserX, Loader2 } from "lucide-react";

const roleLabel = { RECRUITER: "Recruiter", INTERVIEWER: "Interviewer" };

function TeamMembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getTeamMembers();
      setMembers(res.data.data);
    } catch {
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleToggle = async (member) => {
    setActioningId(member.id);
    try {
      if (member.isActive) {
        await deactivateTeamMember(member.id);
      } else {
        await activateTeamMember(member.id);
      }
      await fetchMembers();
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed");
    } finally {
      setActioningId(null);
    }
  };

  if (loading) return <p className="text-text-muted text-sm">Loading team...</p>;
  if (error) return <p className="text-danger text-sm">{error}</p>;
  if (members.length === 0) {
    return <p className="text-text-muted text-sm">No team members invited yet.</p>;
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
        >
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{member.email}</p>
            <p className="text-xs text-text-muted">
              {roleLabel[member.role]}
              {!member.isVerified && " · Pending invite"}
              {member.isVerified && !member.isActive && " · Deactivated"}
            </p>
          </div>
          <button
            onClick={() => handleToggle(member)}
            disabled={actioningId === member.id || !member.isVerified}
            title={!member.isVerified ? "Invite not yet accepted" : ""}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-40 ${
              member.isActive
                ? "border border-danger/20 text-danger hover:bg-danger/5"
                : "border border-success/20 text-success hover:bg-success/5"
            }`}
          >
            {actioningId === member.id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : member.isActive ? (
              <UserX size={13} />
            ) : (
              <UserCheck size={13} />
            )}
            {member.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default TeamMembersList;