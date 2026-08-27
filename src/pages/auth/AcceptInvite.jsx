import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyInvite, acceptInvite } from "../../services/authService";

function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [checking, setChecking] = useState(true);
  const [invite, setInvite] = useState(null); // { email, role, orgName }
  const [checkError, setCheckError] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!token) {
      setCheckError("Invalid or missing invite link.");
      setChecking(false);
      return;
    }
    verifyInvite(token)
      .then((res) => setInvite(res.data.data))
      .catch((err) => setCheckError(err.response?.data?.message || "Invalid or expired invite."))
      .finally(() => setChecking(false));
  }, [token]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await acceptInvite({ token, password: data.password });
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to accept invite. The link may have expired.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
        <p className="text-text-muted text-sm">Checking invite...</p>
      </div>
    );
  }

  if (checkError) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
        <p className="text-danger">{checkError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Accept invite</h1>
        <p className="text-text-muted text-sm mb-6">
          Join <strong>{invite.orgName}</strong> as a <strong>{invite.role === "RECRUITER" ? "Recruiter" : "Interviewer"}</strong> ({invite.email})
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">Set your password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "At least 8 characters, with letters, numbers and a special character",
                },
              })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Joining..." : "Accept & Join"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AcceptInvite;