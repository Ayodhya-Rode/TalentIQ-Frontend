import { useState } from "react";
import { FileSearch, Video, ClipboardCheck, BarChart3 } from "lucide-react";

const stages = [
  {
    icon: FileSearch,
    label: "Screen",
    title: "AI resume screening",
    description:
      "Every application ranked against the role's requirements the moment it lands.",
  },
  {
    icon: Video,
    label: "Interview",
    title: "Structured video rounds",
    description:
      "Same question set, same rubric, every candidate — results you can compare.",
  },
  {
    icon: ClipboardCheck,
    label: "Score",
    title: "Consistent evaluation",
    description:
      "Feedback captured in one format across every interviewer, no exceptions.",
  },
  {
    icon: BarChart3,
    label: "Decide",
    title: "One decision view",
    description:
      "Every candidate's full trail in one dashboard — not five inboxes and a spreadsheet.",
  },
];

function Features() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      id="features"
      className="bg-surface border-b border-border overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 md:pt-12 md:pb-28">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-mono text-accent font-bold tracking-wide">
            The pipeline
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-text tracking-tight">
            Every hire follows the same four stages
          </h2>
          <p className="mt-4 text-base text-text font-medium leading-relaxed">
            No shortcuts, no skipped steps — which is exactly why the outcome
            holds up.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-0 right-0 h-px overflow-hidden">
            <div className="absolute inset-0 bg-border" />

            {hoveredIndex === null && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
                  backgroundSize: "50% 100%",
                  animation: "pipeline-shimmer 3s linear infinite",
                  opacity: 0.6,
                }}
              />
            )}

            <div
              className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
              style={{
                width:
                  hoveredIndex !== null
                    ? `${((hoveredIndex + 1) / stages.length) * 100}%`
                    : "0%",
                backgroundColor: "var(--color-accent)",
              }}
            />
          </div>

          <div
            className="grid md:grid-cols-4 gap-10 md:gap-6 relative"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {stages.map(({ icon: Icon, label, title, description }, i) => {
              const isHovered = hoveredIndex === i;
              const isDimmed = hoveredIndex !== null && !isHovered;

              return (
                <div
                  key={label}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="relative p-5 -m-5 rounded-2xl cursor-default transition-all duration-300 ease-out"
                  style={{
                    transform: isHovered
                      ? "scale(1.08)"
                      : isDimmed
                        ? "scale(0.94)"
                        : "scale(1)",
                    opacity: isDimmed ? 0.55 : 1,
                    zIndex: isHovered ? 10 : 1,
                    backgroundColor: isHovered
                      ? "var(--color-primary)"
                      : "transparent",
                  }}
                >
                  <div className="hidden md:flex items-center justify-center w-[104px] h-[104px] -ml-2">
                    <div
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-all duration-300"
                      style={{
                        backgroundColor: isHovered
                          ? "var(--color-accent)"
                          : "var(--color-bg)",
                        borderWidth: "2px",
                        borderColor: isHovered
                          ? "var(--color-accent)"
                          : "var(--color-primary)",
                        boxShadow: isHovered
                          ? "0 8px 24px rgba(0,0,0,0.25)"
                          : "none",
                      }}
                    >
                      <Icon
                        size={26}
                        style={{
                          color: isHovered ? "#000000" : "var(--color-primary)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="md:hidden flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <span className="font-mono text-xs font-bold text-accent tracking-widest">
                      STAGE {String(i + 1).padStart(2, "0")} —{" "}
                      {label.toUpperCase()}
                    </span>
                  </div>

                  <span
                    className="hidden md:block font-mono text-xs font-bold tracking-widest mb-2 transition-colors duration-300"
                    style={{ color: "var(--color-accent)" }}
                  >
                    STAGE {String(i + 1).padStart(2, "0")} —{" "}
                    {label.toUpperCase()}
                  </span>
                  <h3
                    className="font-display text-lg font-bold mb-2 transition-colors duration-300"
                    style={{ color: isHovered ? "white" : "var(--color-text)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-sm font-medium leading-relaxed transition-colors duration-300"
                    style={{
                      color: isHovered
                        ? "rgba(255,255,255,0.9)"
                        : "var(--color-text)",
                    }}
                  >
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
