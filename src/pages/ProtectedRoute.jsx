import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Else render children (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
