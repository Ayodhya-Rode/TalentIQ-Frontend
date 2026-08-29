import { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { redirectForRole } from "../utils/roleRedirect";

function Navbar({ dark, setDark }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-2xl font-bold text-text tracking-tight flex items-center gap-0.5"
        >
          Talent<span className="text-accent">IQ</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { to: "/", label: "Home" },
            { to: "/features", label: "Features" },
            { to: "/how-it-works", label: "How it works" },
            { to: "#roles", label: "For teams" },
            { to: "/jobs", label: "Jobs" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-sm font-medium text-text hover:text-primary transition-colors group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setDark((prev) => !prev)}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-text hover:text-primary hover:bg-bg transition-colors"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {user ? (
            <>
              <button
                onClick={() => redirectForRole(user, navigate)}
                className="text-sm font-semibold text-text hover:text-primary transition-colors"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-text hover:text-primary transition-colors"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-text"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 flex flex-col gap-4">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-text"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-text"
          >
            Features
          </Link>

          <Link
            to="/how-it-works"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-text"
          >
            How it works
          </Link>

          <Link
            to="/roles"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-text"
          >
            For teams
          </Link>

          <button
            onClick={() => setDark((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-text"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            Toggle theme
          </button>

          {user ? (
            <>
              <button
                onClick={() => {
                  redirectForRole(user, navigate);
                  setMobileOpen(false);
                }}
                className="text-sm font-semibold text-text text-left"
              >
                Dashboard
              </button>

              <button
                onClick={logout}
                className="text-sm font-semibold text-danger text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-text"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-primary"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
