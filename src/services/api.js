import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the refreshToken cookie automatically
});

let getAccessToken = () => null;

// To store the accessToken in memory and use it in the request interceptor
export const setAccessTokenGetter = (fn) => { getAccessToken = fn; };

// runs manually // Check is access token available and add it to the request headers 
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;