import { createContext, useContext, useState, useEffect, useRef } from "react";
import api, { registerAuthHandlers } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // The response interceptor in api.js runs outside React, so it needs a
  // way to read the *current* token synchronously and to update it/log the
  // user out without waiting on a re-render.
  const tokenRef = useRef(null);

  const setToken = (token) => {
    tokenRef.current = token;
    setAccessTokenState(token);
  };

  useEffect(() => {
    registerAuthHandlers({
      getToken: () => tokenRef.current,
      setToken,
      onLogout: () => {
        tokenRef.current = null;
        setAccessTokenState(null);
        setUser(null);
      },
    });
  }, []);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/auth/refresh-token");
        const token = res.data.data.accessToken;
        setToken(token);

        const meRes = await api.get("/auth/me");
        setUser(meRes.data.data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);