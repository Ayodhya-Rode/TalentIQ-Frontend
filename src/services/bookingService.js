import api from "./api";

export const getApprovedOrganizations = () => api.get("/organizations/approved");
export const getAvailableSlots = (organizationId, domain) =>
  api.get(`/bookings/available-slots?organizationId=${organizationId}&domain=${domain}`);
export const createBooking = (data) => api.post("/bookings", data);
export const empCancelBooking = (id) => api.patch(`/bookings/${id}/emp-cancel`);
export const rescheduleBooking = (id, scheduledDate) => api.patch(`/bookings/${id}/reschedule`, { scheduledDate });
export const getBookingsNeedingAttention = () => api.get("/bookings/needs-attention");
export const getFlaggedEmps = () => api.get("/bookings/flagged-emps");