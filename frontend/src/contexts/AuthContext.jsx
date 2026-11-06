import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    axiosClient
      .get("/api/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        sessionStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await axiosClient.post(
      "/api/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = response.data.access_token;

    sessionStorage.setItem("access_token", token);

    try {
      const userResponse = await axiosClient.get("/api/auth/me");
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      sessionStorage.removeItem("access_token");
      setUser(null);
      throw error;
    }
  };

  const register = async (data) => {
    const response = await axiosClient.post(
      "/api/auth/register",
      data
    );

    return response.data;
  };

  const logout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải nằm trong AuthProvider");
  }

  return context;
}