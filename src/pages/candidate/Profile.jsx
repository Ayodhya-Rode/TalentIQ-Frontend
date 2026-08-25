import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getMyProfile, updateMyProfile } from "../../services/candidateService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        const profile = res.data.data.profile;
        reset({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          skills: (profile.skills || []).join(", "),
          bio: profile.bio || "",
        });
      } catch (err) {
        setServerError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

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
      });
      setSuccessMsg("Profile updated successfully");

      setTimeout(() => {
        navigate("/candidate/dashboard");
      }, 1200);
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
      <div className="max-w-2xl mx-auto bg-surface border border-border rounded-lg p-8">
        <h1 className="font-display text-2xl font-semibold mb-6">My Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}
          {successMsg && <p className="text-success text-sm">{successMsg}</p>}

          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Skills</label>
            <input
              type="text"
              placeholder="React, Node.js, PostgreSQL"
              {...register("skills")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-text-muted mt-1">Comma-separated</p>
          </div>

          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              rows={4}
              {...register("bio")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          <Link
            to="/candidate/dashboard"
            className="ml-4 text-primary hover:underline"
          >
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Profile;
