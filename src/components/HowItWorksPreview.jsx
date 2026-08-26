import { Link } from "react-router-dom";
import { UserPlus, Send, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up",
    description: "Create your account and build your profile in minutes.",
  },
  {
    icon: Send,
    title: "Apply & get matched",
    description: "AI screening surfaces you for the right-fit roles.",
  },
  {
    icon: Trophy,
    title: "Interview & track results",
    description: "Structured interviews, live status from your dashboard.",
  },
];

function HowItWorksPreview() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-bg">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span className="text-sm font-mono font-bold tracking-wide text-accent">
              For candidates
            </span>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold text-text tracking-tight">
              From sign-up to offer
            </h2>
          </div>

          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary transition-colors flex-shrink-0"
          >
            See all five steps
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-full border-2 border-accent flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-accent">
                <Icon
                  size={18}
                  className="text-accent transition-colors duration-300 group-hover:text-black"
                />
              </div>
              <h3 className="font-display text-base font-bold text-text mb-1">
                {String(i + 1).padStart(2, "0")}. {title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksPreview;
