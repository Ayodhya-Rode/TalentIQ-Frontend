import api from "./api";

export const getMyProfile = () => api.get("/candidates/profile");
export const updateMyProfile = (data) => api.patch("/candidates/profile", data);
export const uploadResume = (formData) => api.post("/candidates/profile/resume", formData);
export const uploadProfileImage = (formData) =>
  api.post("/candidates/profile/image", formData);

export const generateResume = (targetRole) =>
  api.post("/candidates/resume/generate", { targetRole });