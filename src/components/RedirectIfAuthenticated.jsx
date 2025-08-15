import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const RedirectIfAuthenticated = ({ children }) => {
  const { userAuth } = useContext(UserContext);

  if (userAuth?.isLoggedIn) {
    if (userAuth.role === "admin") return <Navigate to="/admin/dashboard" />;
    if (userAuth.role === "user") return <Navigate to="/user/dashboard" />;
  }

  return children;
};

export default RedirectIfAuthenticated;
