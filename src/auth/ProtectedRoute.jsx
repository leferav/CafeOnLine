import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { obterPrimeiraRotaAcessivel } from "./routes";

export default function ProtectedRoute({ children, permissao }) {
  const { authenticated, temPermissao } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permissao && !temPermissao(permissao)) {
    const destino = obterPrimeiraRotaAcessivel(temPermissao);
    return <Navigate to={destino} replace />;
  }

  return children;
}
