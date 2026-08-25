    import api from "./api";

export const getMyProfile = () => api.get("/candidates/profile");
export const updateMyProfile = (data) => api.patch("/candidates/profile", data);
// export const uploadResume = (formData) => api.post("/candidate/profile/resume", formData);