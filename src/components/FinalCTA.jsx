import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 relative">
        <div className="relative rounded-2xl border border-border bg-surface p-10 md:p-16 text-center transition-all duration-300 hover:border-accent hover:shadow-xl hover:z-20 hover:scale-[1.02]">
          <span className="text-sm font-mono font-bold tracking-wide text-accent">
            Start hiring smarter
          </span>

          <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold text-text tracking-tight">
            Make hiring decisions you can defend.
          </h2>

          <p className="mt-5 text-text-muted leading-relaxed max-w-xl mx-auto">
            Bring applications, interviews, evaluations, and candidate
            decisions into one structured hiring pipeline.
          </p>

          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-lg font-semibold shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Get started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;