import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("reflow_token");
      const storedUser = localStorage.getItem("reflow_user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // If stored user is corrupted, clear it
          console.error("Failed to parse user data", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("reflow_token", token);
      localStorage.setItem("reflow_user", JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (error) {
      // THE FIX: Throw the error back to Login.jsx instead of toasting it here!
      // This stops Login.jsx from navigating to the dashboard.
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("reflow_token");
    localStorage.removeItem("reflow_user");
    setUser(null);
    // Optional: window.location.href = '/login'; // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
