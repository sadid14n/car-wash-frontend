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

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUserAuth(JSON.parse(userData));
      } else {
        setUserAuth(null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      setUserAuth(null);
    }
  }, []);

  return (
    <>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <h1 className="text-center text-2xl">Welcome to Car Wash</h1>
            }
          />
          <Route path="/login" element={<UserAuth />} />

          <Route path="/register" element={<Register />} />

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
                <AdminDashboard />
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
    </>
  );
};

export default App;
