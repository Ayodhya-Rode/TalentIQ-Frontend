import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Video, BarChart3 } from "lucide-react";

const highlights = [
  { icon: ShieldCheck, label: "Bias-resistant scoring" },
  { icon: Video, label: "Structured video rounds" },
  { icon: BarChart3, label: "One decision dashboard" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-mono text-text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            AI-assisted hiring pipeline
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-text leading-[1.1] tracking-tight">
            Hire on evidence,
            <br />
            not gut feeling.
          </h1>

          <p className="mt-6 text-lg text-text-muted max-w-xl leading-relaxed">
            TalentIQ screens resumes, runs structured video interviews, and
            scores every candidate against the same rubric — so hiring
            decisions come from data your team can actually defend.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Get started
              <ArrowRight size={18} />
            </Link>

            <a
              href="#how-it-works"
              className="text-sm font-semibold text-text hover:text-primary transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Highlight cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-accent">
                  <Icon
                    size={18}
                    className="text-primary transition-colors duration-300 group-hover:text-black"
                  />
                </div>

                <span className="text-sm font-semibold text-text">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 right-40 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </section>
  );
}

export default Hero;