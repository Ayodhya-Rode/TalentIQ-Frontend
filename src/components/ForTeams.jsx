// components/ForTeams.jsx

import { Building2, Users, ClipboardCheck, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: Building2,
    title: "Organizations",
    description:
      "Create jobs, manage hiring workflows, review candidates, and make evidence-based hiring decisions from one place.",
  },
  {
    icon: Users,
    title: "Recruiters",
    description:
      "Manage applications, shortlist candidates, schedule interviews, and track the hiring pipeline without scattered spreadsheets.",
  },
  {
    icon: ClipboardCheck,
    title: "Interviewers",
    description:
      "Conduct structured interviews, evaluate candidates using consistent rubrics, and submit feedback in a standardized format.",
  },
];

function ForTeams() {
  return (
    <section id="roles" className="bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Heading */}
        <div className="max-w-2xl mb-14">
          <span className="text-sm font-mono font-bold tracking-wide text-accent">
            For teams
          </span>

          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-text tracking-tight">
            Everyone involved in hiring, working from the same pipeline
          </h2>

          <p className="mt-5 text-text-muted leading-relaxed max-w-xl">
            TalentIQ connects candidates, recruiters, interviewers, and
            organizations in one structured hiring workflow.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-accent">
                <Icon
                  size={20}
                  className="text-primary transition-colors duration-300 group-hover:text-black"
                />
              </div>

              <h3 className="font-display text-lg font-semibold text-text mb-3">
                {title}
              </h3>

              <p className="text-sm text-text-muted leading-relaxed">
                {description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-text group-hover:text-primary transition-colors">
                Learn more
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ForTeams;
