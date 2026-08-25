import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { redirectForRole } from "../../utils/roleRedirect";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = location.state?.email;

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const otp = otpDigits.join("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp) return setError("Please enter OTP");
    if (otp.length !== 6) return setError("OTP must be 6 digits");

    try {
      setLoading(true);
      const response = await verifyOtp({ email, otp });
      setMessage(response.data.message);

      const { accessToken, user } = response.data.data;
      login(accessToken, user);
      redirectForRole(user, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;
    setError("");
    setMessage("");

    try {
      setResending(true);
      const response = await resendOtp({ email });
      setMessage(response.data.message);
      setTimer(60);
      setOtpDigits(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/register" className="mb-4 flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <span className="text-lg">←</span> Back to Register
        </Link>

        <div className="bg-surface border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="text-2xl">✉</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-text">Verify Your Email</h1>
            <p className="mt-2 text-sm text-text-muted">We sent a 6-digit OTP to</p>
            <p className="mt-2 font-mono text-sm font-medium text-primary break-all">{email}</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {message}
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            <label className="mb-2 block text-sm font-medium text-text">Enter OTP</label>
            <div className="flex justify-between gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 rounded-xl border border-border bg-bg text-center font-mono text-2xl text-text outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-primary py-3.5 font-display font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm">
            <span className="text-text-muted">Didn't receive OTP? </span>
            {timer > 0 ? (
              <span className="font-medium text-text-muted">
                Resend OTP in <span className="font-mono text-primary">{timer}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-text-muted">Your verification code expires in 10 minutes.</p>
      </div>
    </div>
  );
};

export default VerifyOtp;