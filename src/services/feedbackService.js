import api from "./api"; 

export const submitFeedback = (bookingId, data) =>
  api.post(`/feedback/${bookingId}/feedback`, data);

export const getFeedback = (bookingId) =>
  api.get(`/feedback/${bookingId}/feedback`);