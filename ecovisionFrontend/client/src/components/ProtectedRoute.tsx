// import { useEffect } from "react";
// import { useLocation } from "wouter";
// import { useAuth } from "@/contexts/AuthContext";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requireAdmin?: boolean;
// }

// export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
//   const { isAuthenticated, user } = useAuth();
//   const [, setLocation] = useLocation();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       setLocation("/login");
//       return;
//     }

//     if (requireAdmin && user?.role !== "admin") {
//       setLocation("/");
//       return;
//     }
//   }, [isAuthenticated, user, requireAdmin, setLocation]);

//   if (!isAuthenticated) {
//     return null;
//   }

//   if (requireAdmin && user?.role !== "admin") {
//     return null;
//   }

//   return <>{children}</>;
// }

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const redirected = useRef(false); // 🧩 prevents multiple redirects

  useEffect(() => {
    // Prevent infinite redirection loops
    if (redirected.current) return;

    if (!isAuthenticated) {
      redirected.current = true;
      setLocation("/login");
      return;
    }

    const userRole = user?.role?.toUpperCase();

    if (requireAdmin && userRole !== "ADMIN") {
      redirected.current = true;
      setLocation("/");
      return;
    }
  }, [isAuthenticated, user, requireAdmin, setLocation]);

  // If not authenticated or not allowed, render nothing
  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role?.toUpperCase() !== "ADMIN") return null;

  return <>{children}</>;
}
