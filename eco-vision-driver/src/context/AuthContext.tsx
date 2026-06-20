import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { loginDriver } from "../api/authService"
import type { AuthUser } from "../types/auth"
import apiClient from "../api/apiClient"
import { loadAuth, saveAuth, clearAuth } from "@/utils/authStorage";
import strapiClient from "@/services/strapiClient"

interface AuthContextType {
  user: AuthUser | null
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  token: string | null
  isAuthenticated: boolean
  authReady: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [token, setToken] = useState<string | null>(
  //   localStorage.getItem("token")
  // )
  const [token, setToken] = useState<string | null>(null);
  // const [user, setUser] = useState<AuthUser | null>(() => {
  //   const stored = localStorage.getItem("user")
  //   return stored ? JSON.parse(stored) : null
  // })
  const [user, setUser] = useState<AuthUser | null>(null);
  // const [profileLoaded, setProfileLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const isAuthenticated = !!token
//   useEffect(() => {
//   if (!user?.documentId) return;

//   const fetchProfile = async () => {
//     try {
//       const res = await strapiClient.get(`/drivers?filters[documentId][$eq]=${user.documentId}`);
//       const item = res.data?.data?.[0];
//       if (!item) return;

//       setUser(prev => prev ? { ...prev, name: item.name, email: item.email } : prev);
//     } catch (err) {
//       console.error("Failed to fetch driver profile", err);
//     }
//   };

//   fetchProfile();
// }, [user?.documentId]);
useEffect(() => {
  const restoreAuth = async () => {
    try {
      const stored = await loadAuth();

      if (stored?.token && stored?.user) {
        setToken(stored.token);
        setUser(stored.user);
      }
    } catch (err) {
      console.error("Failed to restore auth", err);
    } finally {
      setAuthReady(true);
    }
  };

  restoreAuth();
}, []);

useEffect(() => {
  const hydrateProfile = async () => {
    if (!token || !user?.documentId) return;

    try {
      const res = await strapiClient.get(
        `/drivers?filters[documentId][$eq]=${user.documentId}`
      );

      const item = res.data?.data?.[0];
      if (item) {
        setUser(prev =>
          prev
            ? {
                ...prev,
                name: item.name,
                email: item.email,
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Failed to hydrate profile", err);
    }
  };

  hydrateProfile();
}, [token, user?.documentId]);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.common.Authorization
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await loginDriver(email, password)

    if (res.role !== "DRIVER") {
      throw new Error("Not a driver account")
    }

    const driverUser: AuthUser = {
      name: res.name ?? "",
      email: res.email,
      role: "DRIVER",
      documentId: res.documentId,
    }
    console.log("Response:",res);

    // setToken(res.token)
    // setUser(driverUser)
    // localStorage.setItem("token", res.token)
    // localStorage.setItem("user", JSON.stringify(driverUser))
    setToken(res.token);
    setUser(driverUser);
    await saveAuth(res.token, driverUser);

  }

  const logout = async () => {
    // setToken(null);
    // setUser(null);
    // localStorage.clear();
    // delete apiClient.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
    await clearAuth();
    delete apiClient.defaults.headers.common.Authorization;

  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, authReady, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
