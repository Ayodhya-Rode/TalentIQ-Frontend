import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { setAccessTokenGetter } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post("/auth/refresh-token");
        const token = res.data.data.accessToken;
        setAccessToken(token);

        const meRes = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(meRes.data.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  useEffect(() => {
    setAccessTokenGetter(() => accessToken);
  }, [accessToken]);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);