// components/Footer.jsx
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Home", to: "/" },
    { label: "Features", to: "/features" },
    { label: "How it works", to: "/how-it-works" },
  ],
  Company: [
    { label: "For teams", to: "/#roles" },
    { label: "Login", to: "/login" },
    { label: "Get started", to: "/register" },
  ],
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10">
          <div>
            <Link
              to="/"
              className="font-display text-xl font-bold text-text tracking-tight flex items-center gap-0.5"
            >
              Talent<span className="text-accent">IQ</span>
            </Link>
            <p className="mt-3 text-sm text-[#4A5568] dark:text-[#B8C0CC] leading-relaxed max-w-xs">
              An AI-assisted hiring pipeline — resume screening, structured
              interviews, and one decision dashboard your team can defend.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#4A5568] dark:text-[#B8C0CC] uppercase mb-4">
                {heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-text hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4A5568] dark:text-[#B8C0CC]">
            © {year} TalentIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;