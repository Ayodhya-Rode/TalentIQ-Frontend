import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { redirectForRole } from "../../utils/roleRedirect";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await loginUser(data);
      const { accessToken, user } = res.data.data;
      login(accessToken, user);
      redirectForRole(user, navigate);
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-1">TalentIQ</h1>
        <p className="text-text-muted text-sm mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message:
                      "At least 8 characters, with letters, numbers and a special character",
                  },
                })}
                className="w-full px-3 py-2 pr-10 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-danger text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-text-muted">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Link to="/register" className="ml-4 text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
