import api from "./api";

export const getAllOrganizations = () => api.get("/organizations/get-all-organizations");
export const approveOrganization = (id) => api.patch(`/organizations/${id}/approve`);
export const rejectOrganization = (id) => api.patch(`/organizations/${id}/reject`);
export const suspendOrganization = (id) => api.patch(`/organizations/${id}/suspend`);
export const activateOrganization = (id) => api.patch(`/organizations/${id}/activate`);
export const getOrganizationById = (id) => api.get(`/organizations/${id}`);