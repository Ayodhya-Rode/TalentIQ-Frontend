import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

function OrgFormModal({ mode = "create", initialData, onSubmit, onClose }) {
  const [serverError, setServerError] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      industry: initialData?.industry || "",
    },
  });

  const submitHandler = async (data) => {
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("industry", data.industry);
      if (logoFile) formData.append("logo", logoFile);
      await onSubmit(formData);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text">
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-1">
          {mode === "create" ? "Register your organization" : "Edit organization"}
        </h2>
        <p className="text-text-muted text-sm mb-5">
          {mode === "create"
            ? "Submit for approval by the TalentIQ team."
            : "Update your organization details."}
        </p>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">Organization name</label>
            <input
              type="text"
              placeholder="Acme Inc."
              {...register("name", { required: "Organization name is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Industry</label>
            <input
              type="text"
              placeholder="Software / IT Services"
              {...register("industry", { required: "Industry is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.industry && <p className="text-danger text-xs mt-1">{errors.industry.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Logo {mode === "edit" && "(leave empty to keep current)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-text-muted"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "create" ? "Submitting..." : "Saving..."
              : mode === "create" ? "Submit for approval" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrgFormModal;