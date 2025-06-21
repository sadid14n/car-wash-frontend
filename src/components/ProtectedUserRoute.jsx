import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const ProtectedUserRoute = ({ children }) => {
  const { userAuth } = useContext(UserContext);

  if (!userAuth?.isLoggedIn) return <Navigate to="/login" />;

  return children;
};

export default ProtectedUserRoute;
