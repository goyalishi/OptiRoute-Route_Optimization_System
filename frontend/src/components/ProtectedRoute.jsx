import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role");

  // If no token, redirect to login
  if (!token) return <Navigate to="/auth" />;

  // If role is specified, check it
  if (role && userRole !== role) return <Navigate to="/auth" />;

  return <Outlet />; 
};

export default ProtectedRoute;
