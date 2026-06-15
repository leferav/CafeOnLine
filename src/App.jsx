import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";
import { PERMISSOES } from "./auth/AuthContext";

import Home from "./pages/Home.jsx";
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

function LayoutProtegido({ children, permissao }) {
  return (
    <ProtectedRoute permissao={permissao}>
      <Navbar />
      <main className="page">{children}</main>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <LayoutProtegido permissao={PERMISSOES.DASHBOARD}>
            <Home />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros"
        element={
          <LayoutProtegido permissao={PERMISSOES.CADASTROS}>
            <Cadastros />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes"
        element={
          <LayoutProtegido permissao={PERMISSOES.CADASTROS}>
            <Lotes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/comprar-cafe"
        element={
          <LayoutProtegido permissao={PERMISSOES.COMPRAS}>
            <Lotes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/novo"
        element={
          <LayoutProtegido permissao={PERMISSOES.NOVO_LOTE}>
            <NovoLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/:id"
        element={
          <LayoutProtegido permissao={PERMISSOES.CADASTROS}>
            <DetalheLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/comprar-cafe/:id"
        element={
          <LayoutProtegido permissao={PERMISSOES.COMPRAS}>
            <DetalheLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/:id/editar"
        element={
          <LayoutProtegido permissao={PERMISSOES.NOVO_LOTE}>
            <EditarLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes"
        element={
          <LayoutProtegido permissao={PERMISSOES.CLIENTES}>
            <Clientes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes/novo"
        element={
          <LayoutProtegido permissao={PERMISSOES.CLIENTES}>
            <NovoCliente />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes/:id/editar"
        element={
          <LayoutProtegido permissao={PERMISSOES.CLIENTES}>
            <EditarCliente />
          </LayoutProtegido>
        }
      />

      <Route path="/vendas" element={<Navigate to="/compras" replace />} />

      <Route
        path="/negociacoes"
        element={
          <LayoutProtegido permissao={[PERMISSOES.COMPRAS, PERMISSOES.VENDAS]}>
            <Negociacoes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/compras"
        element={
          <LayoutProtegido permissao={[PERMISSOES.COMPRAS, PERMISSOES.VENDAS]}>
            <Compras />
          </LayoutProtegido>
        }
      />

      <Route
        path="/compras/:id/prosseguir"
        element={
          <LayoutProtegido permissao={PERMISSOES.COMPRAS}>
            <ProsseguirCompra />
          </LayoutProtegido>
        }
      />

      <Route path="/lotes" element={<Navigate to="/comprar-cafe" replace />} />
      <Route path="/lotes/novo" element={<Navigate to="/cadastros/lotes/novo" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
