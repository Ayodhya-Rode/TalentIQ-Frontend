// pages/HowItWorksPage.jsx
import { useState } from "react";
import HowItWorks from "../components/HowItWorks";
import FinalCTA from "../components/FinalCTA";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does verification take?",
    a: "Just a quick email OTP after you sign up — usually under a minute.",
  },
  {
    q: "Do I need to apply separately to each role?",
    a: "Yes, but your profile and resume carry over, so applying to a new role only takes a couple of clicks.",
  },
  {
    q: "Can I see my interview feedback?",
    a: "Your score and status update live on your dashboard as soon as an interviewer submits their evaluation.",
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

function HowItWorksPage() {
  return (
    <main>
      <section className="bg-bg">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-4 md:pt-20">
          <span className="text-sm font-mono font-bold tracking-wide text-accent">How it works</span>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-text tracking-tight max-w-2xl">
            From creating an account to getting an offer
          </h1>
          <p className="mt-5 text-text-muted max-w-xl leading-relaxed">
            Here's the full path a candidate takes on TalentIQ, start to finish.
          </p>
        </div>
      </section>

      <HowItWorks />

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

export default HowItWorksPage;