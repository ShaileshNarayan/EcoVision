// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import { AuthProvider } from "./context/AuthContext"
// import { ProtectedRoute } from "./routes/ProtectedRoute"
// import { useAuth } from "./context/AuthContext"
// import LoginPage from "./pages/LoginPage"
// import DashboardPage from "./pages/DashboardPage"
// import TaskDetailsPage from "./pages/TaskDetailsPage"
// import FinishTaskPage from "./pages/FinishTaskPage"
// import DriverProfilePage from "./pages/DriverProfilePage"


// function AuthGate({ children }: { children: React.ReactNode }) {
//   const { authReady } = useAuth();

//   if (!authReady) {
//     return <div className="p-4">Loading…</div>;
//   }

//   return <>{children}</>;
// }

// function App() {
//   const { isAuthenticated } = useAuth();
//   return (
//     <AuthProvider>
//       <AuthGate>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/login" element={<LoginPage />} />

//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <DashboardPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/tasks/:documentId"
//               element={
//                 <ProtectedRoute>
//                   <TaskDetailsPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/tasks/:documentId/finish"
//               element={
//                 <ProtectedRoute>
//                   <FinishTaskPage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <DriverProfilePage />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//                 path="/"
//                 element={
//                   isAuthenticated
//                     ? <Navigate to="/dashboard" />
//                     : <Navigate to="/login" />
//                 }
//               />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </BrowserRouter>
//       </AuthGate>
//     </AuthProvider>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import FinishTaskPage from "./pages/FinishTaskPage";
import DriverProfilePage from "./pages/DriverProfilePage";
import { App as CapacitorAppPlugin } from '@capacitor/app';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouteLoader from "./components/RouteLoader";


function AuthRedirect() {
  const { authReady, isAuthenticated } = useAuth();

  if (!authReady) {
    return <div className="p-4">Loading…</div>;
  }

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
}

// function AndroidBackHandler() {
//   const navigate = useNavigate();

//   useEffect(() => {
//   let removeListener: (() => void) | null = null;

//   const setupListener = async () => {
//     const handler = await CapacitorAppPlugin.addListener('backButton', () => {
//       if (window.history.length > 1) {
//         navigate(-1);
//       } else {
//         CapacitorAppPlugin.exitApp();
//       }
//     });
//     removeListener = handler.remove;
//   };

//   setupListener();

//   return () => {
//     if (removeListener) removeListener();
//   };
// }, [navigate]);


//   return null;
// }
function AndroidBackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let removeListener: (() => void) | null = null;

    const setup = async () => {
      const handler = await CapacitorAppPlugin.addListener("backButton", () => {
        const path = window.location.pathname;

        // Treat dashboard as app root
        if (path === "/dashboard") {
          CapacitorAppPlugin.exitApp();
          return;
        }

        // Normal in-app navigation
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          CapacitorAppPlugin.exitApp();
        }
      });

      removeListener = handler.remove;
    };

    setup();

    return () => {
      if (removeListener) removeListener();
    };
  }, [navigate]);

  return null;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteLoader />
          <AndroidBackHandler />

          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/:documentId"
              element={
                <ProtectedRoute>
                  <TaskDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/:documentId/finish"
              element={
                <ProtectedRoute>
                  <FinishTaskPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DriverProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Smart root redirect */}
            <Route
              path="/"
              element={<AuthRedirect />}
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;