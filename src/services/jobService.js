import api from "./api";

// Recruiter
export const getMyJobs = () => api.get("/jobs/my-jobs");
export const createJob = (data) => api.post("/jobs/create-job", data);
export const updateJob = (id, data) => api.patch(`/jobs/${id}/update-job`, data);
export const closeJob = (id) => api.patch(`/jobs/${id}/close-job`);

// Org Admin
export const getPendingJobs = () => api.get("/jobs/pending-approval");
export const approveJob = (id) => api.patch(`/jobs/${id}/approve-job`);
export const rejectJob = (id, reason) => api.patch(`/jobs/${id}/reject-job`, { reason });

// Public
export const getApprovedJobs = () => api.get("/jobs/approved");