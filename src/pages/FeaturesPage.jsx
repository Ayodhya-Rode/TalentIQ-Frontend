// pages/FeaturesPage.jsx
import { useState } from "react";
import Features from "../components/Features";
import FinalCTA from "../components/FinalCTA";
import {
  ShieldCheck,
  Users,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Bias-resistant by design",
    description:
      "Every candidate is scored against the same rubric, so decisions hold up when someone asks 'why him and not her?'",
  },
  {
    icon: Clock,
    title: "Faster time-to-hire",
    description:
      "AI screening removes the manual resume triage that eats the first week of every open req.",
  },
  {
    icon: Users,
    title: "Aligned interviewers",
    description:
      "Structured video rounds mean every interviewer asks the same questions in the same order.",
  },
  {
    icon: TrendingUp,
    title: "A decision you can defend",
    description:
      "One dashboard with the full trail — resume score, interview notes, evaluation — for every candidate.",
  },
];

const faqs = [
  {
    q: "Does AI screening replace human judgement?",
    a: "No — it ranks and surfaces candidates faster, but every hiring decision is still made by your team.",
  },
  {
    q: "Can we customize the rubric per role?",
    a: "Yes, each role's requirements drive its own scoring criteria across screening and interviews.",
  },
  {
    q: "What do interviewers actually see?",
    a: "A structured question set and a standard feedback form, so every review comes back in the same format.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <h3 className="font-display text-base font-semibold text-text">{q}</h3>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-text-muted transition-transform duration-300 ${
            open ? "rotate-180 text-accent" : ""
          }`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-text-muted leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

function FeaturesPage() {
  return (
    <main>
      <section className="bg-bg">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-20 md:pb-20">
          <span className="text-sm font-mono text-accent font-bold tracking-wide">
            Features
          </span>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-text tracking-tight max-w-2xl">
            A hiring pipeline built to hold up under scrutiny
          </h1>
          <p className="mt-5 text-text-muted max-w-xl leading-relaxed">
            Here's exactly what happens to a candidate at every stage — and why
            it produces decisions your team can defend.
          </p>

          {/* Trust stats row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-10">
            {[
              { value: "4", label: "Pipeline stages" },
              { value: "100%", label: "Same rubric, every candidate" },
              { value: "1", label: "Decision dashboard" },
              { value: "0", label: "Spreadsheets needed" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl font-bold text-text">
                  {value}
                </div>
                <div className="mt-1 text-xs text-text-muted leading-snug">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features />

      <Features />

      <section className="bg-bg">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tight mb-10">
            Why teams switch to this pipeline
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-4 rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:bg-accent">
                  <Icon
                    size={20}
                    className="text-primary transition-colors duration-300 group-hover:text-black"
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text tracking-tight mb-6">
            Common questions
          </h2>
          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}

export default FeaturesPage;
