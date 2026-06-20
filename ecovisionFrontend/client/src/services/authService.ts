import axios from "axios";

const API_BASE = "http://localhost:8080/api/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/login`, { email, password });
  const token = response.data.token;
  localStorage.setItem("token", token);
  return token;
};

export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await axios.get(`${API_BASE}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // { username, role, valid }
  } catch (error) {
    console.error("❌ Token validation failed", error);
    localStorage.removeItem("token");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
