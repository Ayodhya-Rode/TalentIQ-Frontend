import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const employmentTypes = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

function JobFormModal({ mode = "create", initialData, onSubmit, onClose }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      department: initialData?.department || "",
      employmentType: initialData?.employmentType || "FULL_TIME",
      location: initialData?.location || "",
      isRemote: initialData?.isRemote || false,
    },
  });

  const submitHandler = async (data) => {
    setServerError("");
    try {
      await onSubmit(data);
    } catch (err) {
      setServerError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text">
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-1">
          {mode === "create" ? "Post a job" : "Edit job"}
        </h2>
        {mode === "edit" && initialData?.status === "APPROVED" && (
          <p className="text-warning text-sm mb-4">
            This job is live. Saving changes will send it back for admin approval.
          </p>
        )}
        {mode === "create" && (
          <p className="text-text-muted text-sm mb-5">
            This will be submitted for admin approval before it goes live.
          </p>
        )}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">Job title</label>
            <input
              type="text"
              placeholder="Senior Backend Engineer"
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Role responsibilities, requirements..."
              {...register("description", { required: "Description is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.description && <p className="text-danger text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Department</label>
            <input
              type="text"
              placeholder="Engineering"
              {...register("department")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Employment type</label>
            <select
              {...register("employmentType", { required: true })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {employmentTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              placeholder="Bangalore"
              {...register("location")}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isRemote")} className="rounded border-border" />
            Remote-friendly
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Submit for approval" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobFormModal;