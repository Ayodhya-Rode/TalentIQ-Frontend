import { Link } from "react-router-dom";
import {
  FileSearch,
  Video,
  ClipboardCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const stages = [
  { icon: FileSearch, label: "Screen" },
  { icon: Video, label: "Interview" },
  { icon: ClipboardCheck, label: "Score" },
  { icon: BarChart3, label: "Decide" },
];

function FeaturesPreview() {
  return (
    <section id="features" className="bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span className="text-sm font-mono text-accent font-bold tracking-wide">
              The pipeline
            </span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-text tracking-tight">
              Every hire follows the same four stages
            </h2>
          </div>

          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary transition-colors flex-shrink-0"
          >
            Explore the full pipeline
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stages.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="group rounded-xl border border-border bg-bg p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent">
                <Icon
                  size={20}
                  className="text-primary transition-colors duration-300 group-hover:text-black"
                />
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-accent">
                {String(i + 1).padStart(2, "0")} — {label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesPreview;
