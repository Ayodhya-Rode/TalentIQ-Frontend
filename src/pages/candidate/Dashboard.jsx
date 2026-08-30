import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getMyProfile } from "../../services/candidateService";
import DashboardActions from "../../components/DashboardActions";
import { ArrowLeft } from "lucide-react";
import ResumeViewerModal from "../../components/ResumeViewerModal";
import { Mail, Phone, MapPin } from "lucide-react";

function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(" ");

  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [viewingResume, setViewingResume] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data.data.profile);
      } catch (err) {
        // Header will use auth context fallback values.
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = profile?.fullName || "Complete your profile";

  const displayEmail = user?.email || profile?.email || "Add email address";

  const displayPhone = profile?.phone || "Add phone number";

  const displayLocation = profile?.location || "Add location";

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ================= PROFILE HEADER ================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/candidate/my-bookings"
              className="text-sm font-semibold text-primary hover:underline"
            >
              My Interviews →
            </Link>
            <Link
              to="/candidate/book-interview"
              className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Book Mock Interview
            </Link>
            <Link
              to="/candidate/applications"
              className="text-sm font-semibold text-primary hover:underline"
            >
              My Applications →
            </Link>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-surface px-5 py-6 md:px-8 md:py-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-7">
            {/* ================= LEFT: PROFILE ================= */}
            <div className="flex items-center gap-5 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {loadingProfile ? (
                  <span className="text-xl font-semibold text-primary">…</span>
                ) : (
                  <span className="font-display text-2xl md:text-3xl font-bold text-primary">
                    {getInitials(profile?.fullName)}
                  </span>
                )}
              </div>

              {/* Profile information */}
              <div className="min-w-0">
                <h1 className="font-display text-xl md:text-2xl font-semibold text-text truncate">
                  {loadingProfile ? "Loading..." : displayName}
                </h1>

                <div className="mt-3 space-y-2">
                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Mail size={15} className="flex-shrink-0" />
                    <span className="truncate">{displayEmail}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Phone size={15} className="flex-shrink-0" />
                    <span>{displayPhone}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <MapPin size={15} className="flex-shrink-0" />
                    <span>{displayLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT: ACTIONS ================= */}
            <DashboardActions
              onEditProfile={() => navigate("/candidate/profile")}
              onLogout={handleLogout}
            />
          </div>
        </section>

        {!loadingProfile && profile && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Bio */}
            {profile.bio && (
              <section className="md:col-span-2 rounded-2xl border border-border bg-surface p-6">
                <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-2">
                  ABOUT
                </h2>

                <p className="text-sm text-text leading-relaxed">
                  {profile.bio}
                </p>
              </section>
            )}

            {/* Skills */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
                SKILLS
              </h2>

              {profile.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No skills added yet.</p>
              )}
            </section>

            {/* Resume */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
                RESUME
              </h2>

              {profile.resumeUrl ? (
                <button
                  onClick={() => setViewingResume(true)}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View uploaded resume →
                </button>
              ) : (
                <p className="text-sm text-text-muted">
                  No resume uploaded yet.
                </p>
              )}
            </section>

            {/* Education */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
                EDUCATION
              </h2>

              {profile.education?.length ? (
                <div className="flex flex-col gap-3">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="text-sm">
                      <p className="font-semibold text-text">{edu.degree}</p>

                      <p className="text-text-muted">
                        {edu.institution} · {edu.startYear}
                        {edu.endYear ? ` – ${edu.endYear}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  No education added yet.
                </p>
              )}
            </section>

            {/* Certificates */}
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
                CERTIFICATES
              </h2>

              {profile.certificates?.length ? (
                <div className="flex flex-col gap-3">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="text-sm">
                      <p className="font-semibold text-text">{cert.name}</p>

                      <p className="text-text-muted">{cert.issuer}</p>

                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          View credential →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  No certificates added yet.
                </p>
              )}
            </section>

            {/* Projects */}
            <section className="md:col-span-2 rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold text-accent tracking-wide mb-3">
                PROJECTS
              </h2>

              {profile.projects?.length ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <p className="font-semibold text-text mb-1">
                        {proj.name}
                      </p>

                      {proj.description && (
                        <p className="text-sm text-text-muted mb-2">
                          {proj.description}
                        </p>
                      )}

                      {proj.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {proj.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          View project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  No projects added yet.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
      {viewingResume && (
        <ResumeViewerModal
          resumeUrl={profile.resumeUrl}
          onClose={() => setViewingResume(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
