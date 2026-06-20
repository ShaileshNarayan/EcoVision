import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { AdminNav } from "@/components/AdminNav";
import { Footer } from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import NewReport from "@/pages/NewReport";
import ComplaintDetail from "@/pages/ComplaintDetail";
import MyComplaints from "@/pages/MyComplaints";
import Profile from "@/pages/Profile";
import Help from "@/pages/Help";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminComplaints from "@/pages/admin/Complaints";
import AdminDrivers from "@/pages/admin/Drivers";
import AdminReport from "@/pages/admin/Report";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import Complaints from "@/pages/admin/Complaints";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail";


// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={HomePage} />
//       <Route path="/my-complaints" component={MyComplaints} />
//       <Route path="/report" component={NewReport} />
//       <Route path="/complaint/:id" component={ComplaintDetail} />
//       <Route path="/profile">
//         <ProtectedRoute>
//           <Profile />
//         </ProtectedRoute>
//       </Route>
//       <Route path="/help" component={Help} />
//       <Route path="/login" component={Login} />
//       <Route path="/admin">
//         <ProtectedRoute requireAdmin>
//           <AdminDashboard />
//         </ProtectedRoute>
//       </Route>
//       <Route path="/admin/complaints">
//         <ProtectedRoute requireAdmin>
//           <AdminComplaints />
//         </ProtectedRoute>
//       </Route>
//       <Route path="/admin/complaints">
//           <Complaints />
//       </Route>
//       <Route path="/admin/drivers">
//         <ProtectedRoute requireAdmin>
//           <AdminDrivers />
//         </ProtectedRoute>
//       </Route>
//       <Route path="/admin/report">
//         <ProtectedRoute requireAdmin>
//           <AdminReport />
//         </ProtectedRoute>
//       </Route>
//       <Route component={NotFound} />
//     </Switch>
//   );
// }
function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/my-complaints" component={MyComplaints} />
      <Route path="/report" component={NewReport} />
      <Route path="/complaint/:id" component={ComplaintDetail} />

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/help" component={Help} />
      <Route path="/login" component={Login} />

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route path="/admin">
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/complaints">
        <ProtectedRoute requireAdmin>
          <AdminComplaints />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/complaint/:id">
        <ProtectedRoute requireAdmin>
          <AdminComplaintDetail />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/drivers">
        <ProtectedRoute requireAdmin>
          <AdminDrivers />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/report">
        <ProtectedRoute requireAdmin>
          <AdminReport />
        </ProtectedRoute>
      </Route>

      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}


function AppContent() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
  if (!isAuthenticated || !user) return;

  const role = user.role?.toUpperCase();

  // Only redirect if already logged in and currently not on correct path
  if (role === "ADMIN" && !location.startsWith("/admin")) {
    setLocation("/admin");
  } else if (role !== "ADMIN" && location === "/login") {
    setLocation("/profile");
  }
}, [isAuthenticated, user, location, setLocation]);
  const roleNormalized = user?.role ? user.role.toString().toUpperCase() : "";
  const isAdminRoute = location.startsWith("/admin") && isAuthenticated && roleNormalized === "ADMIN";


  return (
    <div className="flex flex-col min-h-screen">
      {isAdminRoute ? <AdminNav /> : <Navbar />}
      <main className="flex-1">
        <Router />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
