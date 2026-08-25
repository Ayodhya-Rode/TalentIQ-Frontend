import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../services/authService";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setMessage("");
    setServerError("");
    try {
      const res = await forgotPassword(data);
      setMessage(res.data.message || "If that email exists, a reset link has been sent.");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">Forgot password</h1>
        <p className="text-text-muted text-sm mb-6">We'll email you a reset link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}
          {message && <p className="text-success text-sm">{message}</p>}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-text-muted">
            <Link to="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;