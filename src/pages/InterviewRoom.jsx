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
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!consented) return;

    getVideoToken(bookingId)
      .then((res) => {
        setToken(res.data.data.token);
        setWsUrl(res.data.data.wsUrl);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || "Failed to join interview"
        );
      });
  }, [bookingId, consented]);

  // Recording consent screen
  if (!consented) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Modal */}
          <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-display text-xl font-semibold text-text">
                    Recording Notice
                  </h2>

                  <p className="text-sm text-text-muted mt-0.5">
                    Before joining the interview
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-text-muted">
                This interview session will be recorded for evaluation,
                scoring, and feedback purposes.
              </p>

              {/* Information box */}
              <div className="mt-5 rounded-xl border border-border bg-bg p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.29 3.86l-7.82 14a2 2 0 001.74 3h15.58a2 2 0 001.74-3l-7.82-14a2 2 0 00-3.42 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text">
                      What you should know
                    </p>

                    <ul className="mt-2 space-y-1.5 text-xs leading-5 text-text-muted">
                      <li>• Your camera and microphone may be recorded.</li>
                      <li>• The recording may be reviewed by authorized users.</li>
                      <li>• The recording may be used for interview evaluation.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="mt-5 flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-primary shrink-0" />

                <p className="text-xs leading-5 text-text-muted">
                  By selecting <span className="font-medium text-text">I Agree</span>,
                  you confirm that you understand and consent to the interview
                  being recorded.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="
                  px-4 py-2.5
                  rounded-lg
                  border border-border
                  text-sm font-medium
                  text-text
                  bg-surface
                  hover:bg-bg
                  transition-colors
                "
              >
                Cancel
              </button>

              <button
                onClick={() => setConsented(true)}
                className="
                  px-5 py-2.5
                  rounded-lg
                  bg-primary
                  text-white
                  text-sm font-medium
                  hover:bg-primary-hover
                  transition-colors
                  shadow-sm
                "
              >
                I Agree & Join
              </button>
            </div>
          </div>

          {/* Small privacy text */}
          <p className="text-center text-xs text-text-muted mt-4">
            Your consent is required before joining this recorded interview.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger text-sm">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-white text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-text-muted">
            Joining interview...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-bg">
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