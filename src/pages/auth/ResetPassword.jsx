import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await resetPassword({ resetToken: token, newPassword: data.password });
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Reset failed. The link may have expired.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
        <p className="text-danger">Invalid or missing reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Reset password</h1>
        <p className="text-text-muted text-sm mb-6">Choose a new password</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">New password</label>
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
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;