import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: (token: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      delete axios.defaults.headers.common["Authorization"];

      const response = await axios.post("http://localhost:8080/api/auth/login", { email, password });

      const { token: jwt, email: userEmail, role } = response.data;
      const normalizedRole = (role || "").toUpperCase();

      let decoded: any = {};
      try {
        decoded = JSON.parse(atob(jwt.split(".")[1]));
      } catch (err) {
        console.warn("Couldn't decode JWT payload", err);
      }

      const name = decoded.name || userEmail.split("@")[0];
      const newUser: User = { name, email: userEmail, role: normalizedRole };

      setUser(newUser);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(newUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      return newUser;
    } catch (err: any) {
      console.error("Auth login error:", err?.response?.status, err?.response?.data || err.message);
      throw err;
    }
  };

  const loginWithGoogle = async (googleToken: string): Promise<User | null> => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/google", { token: googleToken });
      const { token: jwt, email, name, role } = response.data;
      const normalizedRole = (role || "").toUpperCase();

      const newUser: User = { name, email, role: normalizedRole };
      setUser(newUser);
      setToken(jwt);
      localStorage.setItem("token", jwt);
      localStorage.setItem("user", JSON.stringify(newUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      return newUser;
    } catch (err) {
      console.error("Google login error:", err);
      return null;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      delete axios.defaults.headers.common["Authorization"];
      await axios.post("http://localhost:8080/api/auth/register", { name, email, password });
      await login(email, password);
    } catch (err: any) {
      console.error("Auth signup error:", err?.response?.status, err?.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};


