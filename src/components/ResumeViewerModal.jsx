import { X, Download } from "lucide-react";

function ResumeViewerModal({ resumeUrl, onClose }) {
  const extension = resumeUrl.split(".").pop().toLowerCase();
  const isPdf = extension === "pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-lg w-full max-w-2xl h-[80vh] relative flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">Resume</h2>

          <div className="flex items-center gap-3">
            <a
               href={`${resumeUrl}?ik-attachment=true`}
              
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Download size={13} />
              Download
            </a>

            <button
              onClick={onClose}
              className="text-text-muted hover:text-text"
              aria-label="Close resume viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {isPdf ? (
          <iframe
            src={resumeUrl}
            title="Resume preview"
            className="flex-1 w-full rounded-b-lg"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-text-muted text-sm p-6 text-center">
            <p>
              Preview isn't available for this file type (
              {extension.toUpperCase()}).
            </p>
            <p>Use the Download button above to view it.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeViewerModal;
