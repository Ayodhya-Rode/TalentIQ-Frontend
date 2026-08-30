import api from "./api";

export const setMyDomains = (domains) => api.put("/availability/domains", { domains });
export const getMyAvailability = () => api.get("/availability/mine");
export const addAvailabilitySlot = (data) => api.post("/availability/slots", data);
export const deleteAvailabilitySlot = (id) => api.delete(`/availability/slots/${id}`);