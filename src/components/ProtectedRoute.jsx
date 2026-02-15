import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Ili loading spinner

  if (!user) {
    // Šaljemo ga na login, ali pamtimo gde je hteo da ide preko state-a
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}