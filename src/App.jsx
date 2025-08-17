import { Routes, Route } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserAuth from "./pages/UserAuth";
import Navbar from "./components/Navbar";
import { createContext, useEffect, useState } from "react";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import Register from "./pages/Register";
import Dashboard from "./pages/adminDashboard/Dashboard";
import UserManagement from "./pages/adminDashboard/UserManagement";
import Task from "./pages/adminDashboard/Task";
import Calender from "./pages/adminDashboard/Calender";
import Analytics from "./pages/adminDashboard/Analytics";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // ✅ add loading state

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUserAuth(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      setUserAuth(null);
    } finally {
      setLoadingAuth(false); // ✅ stop loading once checked
    }
  }, []);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {/* <Navbar /> */}
      <RedirectIfAuthenticated>
              <UserAuth />
      </RedirectIfAuthenticated>

      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <UserAuth />
            </RedirectIfAuthenticated>
          }
        />

        {/* redirect if authenticated */}
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <UserAuth />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />

        {/* Protected User Route */}

        <Route
          path="/user/dashboard"
          element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectedAdminRoute>
              <Task />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/calender"
          element={
            <ProtectedAdminRoute>
              <Calender />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedAdminRoute>
              <Analytics />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/user-management"
          element={
            <ProtectedAdminRoute>
              <UserManagement />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Page Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Home
              </a>
            </div>
          }
        />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
