import api from "./api";

export const getMyMembership = () => api.get("/organizations/my-membership");