import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends the refreshToken cookie automatically
});

let getAccessToken = () => null;
let setAccessTokenExternal = () => {};
let onAuthFailure = () => {};

// Wired up once by AuthContext so this module can read/write the token
// and force a logout when the refresh token itself is no longer valid.
export const registerAuthHandlers = ({ getToken, setToken, onLogout }) => {
  getAccessToken = getToken;
  setAccessTokenExternal = setToken;
  onAuthFailure = onLogout;
};

// To store the accessToken in memory and use it in the request interceptor
export const setAccessTokenGetter = (fn) => {
  getAccessToken = fn;
};

// runs manually // Check is access token available and add it to the request headers
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If multiple requests 401 at the same time, only refresh once and let
// the rest wait on the same promise.
let refreshPromise = null;

// On a 401, silently refresh the access token (using the httpOnly
// refreshToken cookie) and retry the original request exactly once.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint =
      config?.url?.includes("/auth/login") ||
      config?.url?.includes("/auth/refresh-token") ||
      config?.url?.includes("/auth/logout");

    if (
      response?.status === 401 &&
      config &&
      !config._retry &&
      !isAuthEndpoint
    ) {
      config._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh-token").finally(() => {
            refreshPromise = null;
          });
        }
        const refreshRes = await refreshPromise;
        const newToken = refreshRes.data.data.accessToken;
        setAccessTokenExternal(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshErr) {
        setAccessTokenExternal(null);
        onAuthFailure();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
