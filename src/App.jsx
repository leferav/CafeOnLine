import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import {
  LEGACY_REDIRECTS,
  ROUTE_PAGES,
  obterPrimeiraRotaAcessivel,
} from "./auth/routes";

import Home from "./pages/Home.jsx";
import SemAcesso from "./pages/SemAcesso.jsx";
import Compras from "./pages/Compras";
import ProsseguirCompra from "./pages/ProsseguirCompra.jsx";
import Negociacoes from "./pages/Negociacoes.jsx";
import Cadastros from "./pages/Cadastro/Cadastros.jsx";

import Lotes from "./pages/Cadastro/Lote/Lotes.jsx";
import NovoLote from "./pages/Cadastro/Lote/NovoLote.jsx";
import EditarLote from "./pages/Cadastro/Lote/EditarLote.jsx";
import DetalheLote from "./pages/Cadastro/Lote/DetalheLote.jsx";

import Clientes from "./pages/Cadastro/Cliente/Clientes.jsx";
import NovoCliente from "./pages/Cadastro/Cliente/NovoCliente.jsx";
import EditarCliente from "./pages/Cadastro/Cliente/EditarCliente.jsx";

const PAGE_COMPONENTS = {
  Home,
  SemAcesso,
  Cadastros,
  Lotes,
  NovoLote,
  EditarLote,
  DetalheLote,
  Clientes,
  NovoCliente,
  EditarCliente,
  Negociacoes,
  Compras,
  ProsseguirCompra,
};

function LayoutProtegido({ children, permissao }) {
  return (
    <ProtectedRoute permissao={permissao}>
      <Navbar />
      <main className="page">{children}</main>
    </ProtectedRoute>
  );
}

function RedirectFallback() {
  const { authenticated, temPermissao } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={obterPrimeiraRotaAcessivel(temPermissao)} replace />;
}

function RedirectLegacyLoteDetalhe() {
  const { id } = useParams();
  return <Navigate to={`/comprar-cafe/${id}`} replace />;
}

function RedirectLegacyLoteEditar() {
  const { id } = useParams();
  return <Navigate to={`/cadastros/lotes/${id}/editar`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {ROUTE_PAGES.map((route) => {
        const Component = PAGE_COMPONENTS[route.component];
        return (
          <Route
            key={route.id}
            path={route.path}
            element={
              <LayoutProtegido permissao={route.permissao}>
                <Component />
              </LayoutProtegido>
            }
          />
        );
      })}

      {LEGACY_REDIRECTS.map((redirect) => (
        <Route
          key={redirect.path}
          path={redirect.path}
          element={<Navigate to={redirect.to} replace />}
        />
      ))}

      <Route path="/lotes/:id/editar" element={<RedirectLegacyLoteEditar />} />
      <Route path="/lotes/:id" element={<RedirectLegacyLoteDetalhe />} />

      <Route path="*" element={<RedirectFallback />} />
    </Routes>
  );
}
