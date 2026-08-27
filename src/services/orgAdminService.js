import api from "./api";

export const getMyOrganization = () => api.get("/organizations/my-organization");

export const registerOrganization = (formData) =>
  api.post("/organizations/register", formData);

export const updateOrganization = (formData) => api.patch("/organizations/my-organization", formData);
export const deleteOrganization = () => api.delete("/organizations/my-organization");