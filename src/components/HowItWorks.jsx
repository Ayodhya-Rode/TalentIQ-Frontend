// components/HowItWorks.jsx

import { useEffect, useRef, useState } from "react";
import {
  UserPlus,
  FileText,
  Send,
  Video,
  Trophy,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up & verify",
    description:
      "Create your account and confirm your email with a quick OTP — takes under a minute.",
  },
  {
    icon: FileText,
    title: "Build your profile",
    description:
      "Add your skills, experience, education, and upload your resume once.",
  },
  {
    icon: Send,
    title: "Apply & get matched",
    description:
      "Apply to roles and let AI screening surface you for the right-fit positions.",
  },
  {
    icon: Video,
    title: "Interview on video",
    description:
      "Every interviewer follows the same structured rubric — no surprises, no bias.",
  },
  {
    icon: Trophy,
    title: "Track your results",
    description:
      "See your score, feedback, and status update live from your dashboard.",
  },
];

function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const stepRefs = useRef([]);

  const [pathHeight, setPathHeight] = useState(700);

  /*
   * Get actual height of the steps container.
   */
  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return;

      const height =
        containerRef.current.getBoundingClientRect().height;

      setPathHeight(height);
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  /*
   * Get the actual vertical position of a step.
   */
  const getStepPosition = (index) => {
    if (!containerRef.current || !stepRefs.current[index]) {
      return 0;
    }

    const containerRect =
      containerRef.current.getBoundingClientRect();

    const stepRect =
      stepRefs.current[index].getBoundingClientRect();

    return (
      stepRect.top -
      containerRect.top +
      stepRect.height / 2
    );
  };

  /*
   * Calculate curve progress based on
   * the actual active step position.
   */
  const getCurveProgress = () => {
    if (!pathHeight) return 0;

    const position = getStepPosition(activeIndex);

    return Math.min(
      100,
      Math.max(0, (position / pathHeight) * 100)
    );
  };

  /*
   * Mouse-position based step activation.
   */
  const handleMouseMove = (event) => {
    if (!containerRef.current) return;

    const containerRect =
      containerRef.current.getBoundingClientRect();

    const mouseY =
      event.clientY - containerRect.top;

    const containerHeight =
      containerRect.height;

    const stepHeight =
      containerHeight / steps.length;

    let index = Math.floor(mouseY / stepHeight);

    index = Math.max(
      0,
      Math.min(index, steps.length - 1)
    );

    setActiveIndex(index);
  };

  /*
   * Reset to first step when mouse leaves.
   */
  const handleMouseLeave = () => {
    setActiveIndex(0);
  };

  const curveProgress = getCurveProgress();

  /*
   * Same curve path for both background
   * and active curve.
   */
  const curvePath = `
    M24,10
    C42,${pathHeight * 0.14}
     6,${pathHeight * 0.20}
     24,${pathHeight * 0.30}

    C42,${pathHeight * 0.38}
     6,${pathHeight * 0.44}
     24,${pathHeight * 0.52}

    C42,${pathHeight * 0.60}
     6,${pathHeight * 0.68}
     24,${pathHeight * 0.76}

    C42,${pathHeight * 0.84}
     6,${pathHeight * 0.92}
     24,${pathHeight - 10}
  `;

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-bg"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 relative">
        
        {/* Heading */}
        <div className="max-w-xl mb-12">
          <span className="text-sm font-mono font-bold tracking-wide text-accent">
            For candidates
          </span>

          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-text tracking-tight">
            From sign-up to offer, five steps
          </h2>
        </div>

        {/* ONE OUTER BOX */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="
            relative
            bg-surface
            border
            border-border
            rounded-2xl
            overflow-hidden
            shadow-sm
          "
        >
          {/* Curve */}
          <svg
            className="
              absolute
              left-6
              top-0
              w-12
              h-full
              pointer-events-none
              overflow-visible
            "
            viewBox={`0 0 48 ${pathHeight}`}
            preserveAspectRatio="none"
          >
            {/* Background curve */}
            <path
              d={curvePath}
              stroke="var(--color-border)"
              strokeWidth="2"
              fill="none"
            />

            {/* Active curve */}
            <path
              d={curvePath}
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              fill="none"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - curveProgress}
              style={{
                transition:
                  "stroke-dashoffset 0.25s ease-out",
              }}
            />
          </svg>

          {/* Steps */}
          <div className="relative flex flex-col gap-1 p-5 md:p-7">
            {steps.map(
              ({ icon: Icon, title, description }, i) => {
                const isActive =
                  activeIndex === i;

                return (
                  <div
                    key={title}
                    ref={(element) => {
                      stepRefs.current[i] = element;
                    }}
                    className="
                      relative
                      flex
                      gap-6
                      items-start
                      rounded-xl
                      px-3
                      py-5
                      cursor-pointer
                      transition-all
                      duration-300
                    "
                  >
                    {/* Icon */}
                    <div
                      className="
                        relative
                        z-10
                        flex-shrink-0
                        w-12
                        h-12
                        rounded-full
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                      "
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-accent)"
                          : "var(--color-surface)",

                        border: `2px solid ${
                          isActive
                            ? "var(--color-accent)"
                            : "var(--color-border)"
                        }`,

                        boxShadow: isActive
                          ? "0 0 24px rgba(221,139,63,0.45)"
                          : "none",
                      }}
                    >
                      <Icon
                        size={20}
                        style={{
                          color: isActive
                            ? "#000000"
                            : "var(--color-text-muted)",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="pt-2">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="
                            font-mono
                            text-xs
                            font-bold
                            tracking-widest
                            transition-colors
                            duration-300
                          "
                          style={{
                            color: isActive
                              ? "var(--color-accent)"
                              : "var(--color-text-muted)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <h3
                          className="
                            font-display
                            text-lg
                            font-bold
                            transition-colors
                            duration-300
                          "
                          style={{
                            color:
                              "var(--color-text)",
                          }}
                        >
                          {title}
                        </h3>
                      </div>

                      <p
                        className="
                          text-sm
                          font-medium
                          leading-relaxed
                          transition-colors
                          duration-300
                        "
                        style={{
                          color: isActive
                            ? "var(--color-text)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        {description}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;