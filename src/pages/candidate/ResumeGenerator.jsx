import { useState } from "react";
import { Link } from "react-router-dom";
import { generateResume } from "../../services/candidateService";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "../../components/ResumePDF";

function ResumeGenerator() {
  const [targetRole, setTargetRole] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const res = await generateResume(targetRole.trim());
      setResume(res.data.data.resume);
      setProfile(res.data.data.profile);
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate resume");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">
            AI Resume Generator
          </h1>
          <Link
            to="/candidate/dashboard"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>

        <form
          onSubmit={handleGenerate}
          className="rounded-2xl border border-border bg-surface p-6 mb-6"
        >
          <label className="block text-sm font-medium text-text mb-1">
            Target role
          </label>
          <p className="text-xs text-text-muted mb-3">
            We'll pull the rest from your saved profile.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={status === "loading" || !targetRole.trim()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50"
            >
              <Sparkles size={16} />
              {status === "loading" ? "Generating..." : "Generate"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-danger text-sm mt-3">{error}</p>
          )}
        </form>

        {status === "success" && resume && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-2">
              SUMMARY
            </h2>
            <p className="text-sm text-text leading-relaxed mb-6">
              {resume.summary}
            </p>

            <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
              PROJECTS
            </h2>
            <div className="flex flex-col gap-4 mb-6">
              {resume.projectBullets?.map((proj) => (
                <div key={proj.projectName}>
                  <p className="font-semibold text-text text-sm mb-1">
                    {proj.projectName}
                  </p>
                  <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
              ATS KEYWORDS
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.atsKeywords?.map((kw) => (
                <span
                  key={kw}
                  className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                >
                  {kw}
                </span>
              ))}
            </div>

            {profile && (
              <div className="mt-6">
                <PDFDownloadLink
                  document={
                    <ResumePDF
                      resume={resume}
                      profile={profile}
                      targetRole={targetRole}
                    />
                  }
                  fileName={`${profile.fullName || "resume"}-${targetRole}.pdf`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  {({ loading }) =>
                    loading ? "Preparing PDF..." : "Download PDF"
                  }
                </PDFDownloadLink>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeGenerator;
