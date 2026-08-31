import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { getVideoToken } from "../services/bookingService";

function InterviewRoom() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [wsUrl, setWsUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getVideoToken(bookingId)
      .then((res) => {
        setToken(res.data.data.token);
        setWsUrl(res.data.data.wsUrl);
      })
      .catch((err) => setError(err?.response?.data?.message || "Failed to join"));
  }, [bookingId]);

  if (error) return <div className="min-h-screen flex items-center justify-center text-danger">{error}</div>;
  if (!token) return <div className="min-h-screen flex items-center justify-center text-text-muted">Joining...</div>;

  return (
    <div className="h-screen">
      <LiveKitRoom
        video
        audio
        token={token}
        serverUrl={wsUrl}
        data-lk-theme="default"
        onDisconnected={() => navigate(-1)}
        style={{ height: "100%" }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}

export default InterviewRoom;