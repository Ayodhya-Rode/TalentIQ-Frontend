import api from "./api";

// Candidate
export const applyToJob = (jobId, data) => api.post(`/applications/apply/${jobId}`, data);
export const getMyApplications = () => api.get("/applications/my-applications");

// Recruiter
export const getApplicationsForJob = (jobId) => api.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });

// Org Admin
export const getAllApplicationsForOrg = () => api.get("/applications/org-all");