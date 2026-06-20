import axios from "axios"
import { ENV } from "@/config/env";

console.log("🚀 Backend API:", ENV.BACKEND_API_URL)
const apiClient = axios.create({
  baseURL: `${ENV.BACKEND_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
