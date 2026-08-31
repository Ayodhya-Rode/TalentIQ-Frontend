import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";

function JoinButton({ scheduledDate, bookingId }) {
  const navigate = useNavigate();
  const minutesUntil = (new Date(scheduledDate) - new Date()) / (1000 * 60);
  const canJoin = minutesUntil <= 10 && minutesUntil > -60;

  if (!canJoin) {
    return <p className="text-xs text-text-muted mt-2">Join link available 10 minutes before the interview</p>;
  }

  return (
    <button
      onClick={() => navigate(`/interview/${bookingId}`)}
      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-success text-white px-3 py-1.5 rounded-md mt-2"
    >
      <Video size={13} />
      Join Interview
    </button>
  );
}

export default JoinButton;