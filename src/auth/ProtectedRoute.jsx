import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { obterPrimeiraRotaAcessivel } from "./routes";

export default function ProtectedRoute({ children, permissao }) {
  const { authenticated, temPermissao } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permissao && !temPermissao(permissao)) {
    const destino = obterPrimeiraRotaAcessivel(temPermissao);
    return <Navigate to={destino} replace />;
  }

  return children;
}
