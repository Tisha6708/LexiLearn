import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("lexi_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("lexi_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.setToken(token);
      // fetch user profile to confirm token validity
      api.get("/users/me")
        .then(res => {
          setUser(res.data);
          localStorage.setItem("lexi_user", JSON.stringify(res.data));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async ({ email, password }) => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const res = await api.post("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const { access_token } = res.data;
    setToken(access_token);
    localStorage.setItem("lexi_token", access_token);
    api.setToken(access_token);
    const me = await api.get("/users/me");
    setUser(me.data);
    localStorage.setItem("lexi_user", JSON.stringify(me.data));
    setLoading(false);
    return me.data; // ✅ This allows frontend to get user.role
  } catch (err) {
    setLoading(false);
    throw err;
  }
};


  const signup = async ({ email, password, full_name, role }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { email, password, full_name, role });
      // after signup, auto-login
      await login({ email, password });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.clearToken();
    localStorage.removeItem("lexi_token");
    localStorage.removeItem("lexi_user");
  };

  const updateProgress = async (progressPatch) => {
    if (!token) throw new Error("Not authenticated");
    const res = await api.post("/users/progress", { progress: progressPatch });
    setUser(res.data);
    localStorage.setItem("lexi_user", JSON.stringify(res.data));
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
