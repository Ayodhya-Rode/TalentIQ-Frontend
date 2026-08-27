import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

function TeamMemberFormModal({ onSubmit, onClose }) {
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", role: "RECRUITER" },
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
      <div className="bg-surface border border-border rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text">
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-1">Invite team member</h2>
        <p className="text-text-muted text-sm mb-5">
          They'll receive an email with a link to set their password and join.
        </p>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          {serverError && <p className="text-danger text-sm">{serverError}</p>}

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="jane@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              {...register("role", { required: true })}
              className="w-full px-3 py-2 rounded border border-border bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="RECRUITER">Recruiter</option>
              <option value="INTERVIEWER">Interviewer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sending invite..." : "Send invite"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamMemberFormModal;