import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  uploadProfileImage,
} from "../../services/candidateService";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Trash2, UploadCloud, Camera } from "lucide-react";

function AccordionSection({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h2 className="font-display text-base font-semibold text-text">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
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
          <div className="px-5 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-bg text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "block text-sm font-medium text-text mb-1";

function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(" ");

  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function Profile() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState("idle");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileImageStatus, setProfileImageStatus] = useState("idle");
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      skills: "",
      bio: "",
      education: [],
      certifications: [],
      projects: [],
      portfolioUrl: "",
      githubUrl: "",
      linkedinUrl: "",
    },
  });

  const education = useFieldArray({ control, name: "education" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const projects = useFieldArray({ control, name: "projects" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const profile = res.data.data.profile;
        setProfileImagePreview(profile.profileImage || "");

        reset({
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          skills: (profile.skills || []).join(", "),
          bio: profile.bio || "",
          education: (profile.education || []).map((e) => ({
            institution: e.institution || "",
            degree: e.degree || "",
            startYear: e.startYear || "",
            endYear: e.endYear || "",
          })),
          certifications: (profile.certificates || []).map((c) => ({
            name: c.name || "",
            issuer: c.issuer || "",
            date: c.issueDate
              ? new Date(c.issueDate).toISOString().slice(0, 7)
              : "",
            url: c.credentialUrl || "",
          })),
          projects: (profile.projects || []).map((p) => ({
            name: p.name || "",
            description: p.description || "",
            techStack: (p.techStack || []).join(", "),
            link: p.link || "",
          })),
          portfolioUrl: profile.portfolioUrl || "",
          githubUrl: profile.githubUrl || "",
          linkedinUrl: profile.linkedinUrl || "",
        });
      } catch (err) {
        setServerError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleResumeChange = (e) => setResumeFile(e.target.files?.[0] || null);

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setResumeStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await uploadResume(formData);
      setResumeStatus("success");
    } catch (err) {
      setResumeStatus("error");
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImage) return;
    setProfileImageStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const res = await uploadProfileImage(formData);
      setProfileImagePreview(res.data.data.profileImage);
      setProfileImage(null);
      setProfileImageStatus("success");
    } catch (err) {
      setProfileImageStatus("error");
    }
  };

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMsg("");
    try {
      const skillsArray = data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await updateMyProfile({
        fullName: data.fullName,
        phone: data.phone,
        skills: skillsArray,
        bio: data.bio,
        location: data.location,
        education: data.education,
        certifications: data.certifications,
        projects: data.projects,
        portfolioUrl: data.portfolioUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
      });

      setSuccessMsg("Profile updated successfully");
      setTimeout(() => navigate("/candidate/dashboard"), 1200);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">Edit Profile</h1>
          <Link
            to="/candidate/dashboard"
            className="text-sm text-primary hover:underline"
          >
            Back to dashboard
          </Link>
        </div>

        {serverError && (
          <p className="text-danger text-sm mb-4">{serverError}</p>
        )}
        {successMsg && (
          <p className="text-success text-sm mb-4">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Basic info */}
          <AccordionSection
            title="Basic info"
            subtitle="Your name, contact, and location"
            defaultOpen
          >
            <div className="mb-5 flex items-center gap-5">
              <div className="relative">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-primary">
                      {getInitials(watch("fullName"))}
                    </span>
                  </div>
                )}

                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-colors"
                >
                  <Camera size={15} />
                </label>

                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setProfileImage(file);
                    setProfileImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              {profileImage && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={handleProfileImageUpload}
                    disabled={profileImageStatus === "uploading"}
                    className="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    {profileImageStatus === "uploading"
                      ? "Uploading..."
                      : "Upload photo"}
                  </button>

                  {profileImageStatus === "success" && (
                    <p className="text-xs text-success mt-1">
                      Photo uploaded successfully.
                    </p>
                  )}

                  {profileImageStatus === "error" && (
                    <p className="text-xs text-danger mt-1">
                      Upload failed. Please try again.
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-text">Profile photo</p>

                <p className="text-xs text-text-muted mt-1">JPG, PNG or WEBP</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  type="text"
                  {...register("fullName")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="text"
                  {...register("phone", {
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  })}
                  className={inputClass}
                />
                {errors.phone && (
                  <p className="text-danger text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  {...register("location")}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Bio</label>
              <textarea rows={3} {...register("bio")} className={inputClass} />
            </div>
          </AccordionSection>

          {/* Resume */}
          <AccordionSection
            title="Resume"
            subtitle="Upload or replace your resume"
          >
            <label
              htmlFor="profile-resume-upload"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-accent transition-colors cursor-pointer p-6 text-center"
            >
              <UploadCloud size={22} className="text-text-muted" />
              <p className="text-sm text-text">
                {resumeFile
                  ? resumeFile.name
                  : "Click to select a PDF or Word file"}
              </p>
              <input
                id="profile-resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
              />
            </label>
            {resumeFile && (
              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={resumeStatus === "uploading"}
                className="mt-3 text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg disabled:opacity-60"
              >
                {resumeStatus === "uploading"
                  ? "Uploading..."
                  : "Upload resume"}
              </button>
            )}
            {resumeStatus === "success" && (
              <p className="text-sm text-success mt-2">
                Resume uploaded successfully.
              </p>
            )}
            {resumeStatus === "error" && (
              <p className="text-sm text-danger mt-2">
                Upload failed. Please try again.
              </p>
            )}
          </AccordionSection>

          {/* Skills */}
          <AccordionSection
            title="Skills"
            subtitle="Comma-separated list of your skills"
          >
            <input
              type="text"
              placeholder="React, Node.js, PostgreSQL"
              {...register("skills")}
              className={inputClass}
            />
          </AccordionSection>

          {/* Education */}
          <AccordionSection
            title="Education"
            subtitle="Your degrees and institutions"
          >
            <div className="flex flex-col gap-4">
              {education.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => education.remove(index)}
                    className="absolute top-3 right-3 text-text-muted hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input
                        {...register(`education.${index}.institution`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Degree / field of study
                      </label>
                      <input
                        {...register(`education.${index}.degree`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Start year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.startYear`, {
                          required: "Start year is required",
                          valueAsNumber: true,
                          min: { value: 1950, message: "Enter a valid year" },
                          max: { value: 2035, message: "Enter a valid year" },
                        })}
                        className={inputClass}
                      />
                      {errors.education?.[index]?.startYear && (
                        <p className="text-danger text-xs mt-1">
                          {errors.education[index].startYear.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>End year</label>
                      <input
                        type="number"
                        {...register(`education.${index}.endYear`, {
                          valueAsNumber: true,
                          min: { value: 1950, message: "Enter a valid year" },
                          max: { value: 2035, message: "Enter a valid year" },
                        })}
                        className={inputClass}
                      />
                      {errors.education?.[index]?.endYear && (
                        <p className="text-danger text-xs mt-1">
                          {errors.education[index].endYear.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  education.append({
                    institution: "",
                    degree: "",
                    startYear: "",
                    endYear: "",
                  })
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline self-start"
              >
                <Plus size={15} /> Add education
              </button>
            </div>
          </AccordionSection>

          {/* Links */}
          <AccordionSection
            title="Links"
            subtitle="Portfolio, GitHub, and LinkedIn (optional)"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  {...register("portfolioUrl", {
                    pattern: {
                      value: /^https?:\/\/.+\.+/,
                      message:
                        "Enter a valid URL (starting with http:// or https://)",
                    },
                  })}
                  className={inputClass}
                />
                {errors.portfolioUrl && (
                  <p className="text-danger text-xs mt-1">
                    {errors.portfolioUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  {...register("githubUrl", {
                    pattern: {
                      value: /^https?:\/\/.+\.+/,
                      message:
                        "Enter a valid URL (starting with http:// or https://)",
                    },
                  })}
                  className={inputClass}
                />
                {errors.githubUrl && (
                  <p className="text-danger text-xs mt-1">
                    {errors.githubUrl.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  {...register("linkedinUrl", {
                    pattern: {
                      value: /^https?:\/\/.+\.+/,
                      message:
                        "Enter a valid URL (starting with http:// or https://)",
                    },
                  })}
                  className={inputClass}
                />
                {errors.linkedinUrl && (
                  <p className="text-danger text-xs mt-1">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>
            </div>
          </AccordionSection>

          {/* Certifications */}
          <AccordionSection title="Certifications" subtitle="Optional">
            <div className="flex flex-col gap-4">
              {certifications.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => certifications.remove(index)}
                    className="absolute top-3 right-3 text-text-muted hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className={labelClass}>Certification name</label>
                      <input
                        {...register(`certifications.${index}.name`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Issuing organization</label>
                      <input
                        {...register(`certifications.${index}.issuer`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Date earned</label>
                      <input
                        type="month"
                        {...register(`certifications.${index}.date`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Credential URL</label>
                      <input
                        {...register(`certifications.${index}.url`, {
                          pattern: {
                            value: /^https?:\/\/.+\.+/,
                            message:
                              "Enter a valid URL (starting with http:// or https://)",
                          },
                        })}
                        className={inputClass}
                      />
                      {errors.certifications?.[index]?.url && (
                        <p className="text-danger text-xs mt-1">
                          {errors.certifications[index].url.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  certifications.append({
                    name: "",
                    issuer: "",
                    date: "",
                    url: "",
                  })
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline self-start"
              >
                <Plus size={15} /> Add certification
              </button>
            </div>
          </AccordionSection>

          {/* Projects */}
          <AccordionSection
            title="Projects"
            subtitle="Optional — great for showcasing hands-on work"
          >
            <div className="flex flex-col gap-4">
              {projects.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border p-4 relative"
                >
                  <button
                    type="button"
                    onClick={() => projects.remove(index)}
                    className="absolute top-3 right-3 text-text-muted hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid gap-3 pr-8">
                    <div>
                      <label className={labelClass}>Project name</label>
                      <input
                        {...register(`projects.${index}.name`)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        rows={2}
                        {...register(`projects.${index}.description`)}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Tech stack</label>
                        <input
                          placeholder="React, Express, PostgreSQL"
                          {...register(`projects.${index}.techStack`)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Link (optional)</label>
                        <input
                          {...register(`projects.${index}.link`, {
                            pattern: {
                              value: /^https?:\/\/.+\.+/,
                              message:
                                "Enter a valid URL (starting with http:// or https://)",
                            },
                          })}
                          className={inputClass}
                        />
                        {errors.projects?.[index]?.link && (
                          <p className="text-danger text-xs mt-1">
                            {errors.projects[index].link.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  projects.append({
                    name: "",
                    description: "",
                    techStack: "",
                    link: "",
                  })
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline self-start"
              >
                <Plus size={15} /> Add project
              </button>
            </div>
          </AccordionSection>

          <div className="flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
            <Link
              to="/candidate/dashboard"
              className="text-primary hover:underline text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;