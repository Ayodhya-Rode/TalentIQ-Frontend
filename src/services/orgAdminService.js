import api from "./api";

export const getMyOrganization = () => api.get("/organizations/my-organization");

export const registerOrganization = (formData) =>
  api.post("/organizations/register", formData);

export const updateOrganization = (formData) => api.patch("/organizations/my-organization", formData);
export const deleteOrganization = () => api.delete("/organizations/my-organization");

export const inviteTeamMember = (data) => api.post("/organizations/team-members", data);

export const getTeamMembers = () => api.get("/organizations/team-members");
export const deactivateTeamMember = (id) => api.patch(`/organizations/team-members/${id}/deactivate`);
export const activateTeamMember = (id) => api.patch(`/organizations/team-members/${id}/activate`);