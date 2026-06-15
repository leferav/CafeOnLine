import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, permissao }) {
  const { authenticated, temPermissao } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permissao && !temPermissao(permissao)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
