import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

import Home from "./pages/Home.jsx";
import Compras from "./pages/Compras";
import Cadastros from "./pages/Cadastro/Cadastros.jsx";

import Lotes from "./pages/Cadastro/Lote/Lotes.jsx";
import NovoLote from "./pages/Cadastro/Lote/NovoLote.jsx";
import EditarLote from "./pages/Cadastro/Lote/EditarLote.jsx";
import DetalheLote from "./pages/Cadastro/Lote/DetalheLote.jsx";

import Clientes from "./pages/Cadastro/Cliente/Clientes.jsx";
import NovoCliente from "./pages/Cadastro/Cliente/NovoCliente.jsx";
import EditarCliente from "./pages/Cadastro/Cliente/EditarCliente.jsx";

function LayoutProtegido({ children }) {
  return (
    <ProtectedRoute>
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
          <LayoutProtegido>
            <Home />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros"
        element={
          <LayoutProtegido>
            <Cadastros />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes"
        element={
          <LayoutProtegido>
            <Lotes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/novo"
        element={
          <LayoutProtegido>
            <NovoLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/:id"
        element={
          <LayoutProtegido>
            <DetalheLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/lotes/:id/editar"
        element={
          <LayoutProtegido>
            <EditarLote />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes"
        element={
          <LayoutProtegido>
            <Clientes />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes/novo"
        element={
          <LayoutProtegido>
            <NovoCliente />
          </LayoutProtegido>
        }
      />

      <Route
        path="/cadastros/clientes/:id/editar"
        element={
          <LayoutProtegido>
            <EditarCliente />
          </LayoutProtegido>
        }
      />

      <Route path="/vendas" element={<Navigate to="/compras" replace />} />

      <Route
        path="/compras"
        element={
          <LayoutProtegido>
            <Compras />
          </LayoutProtegido>
        }
      />

      <Route path="/lotes" element={<Navigate to="/cadastros/lotes" replace />} />
      <Route path="/lotes/novo" element={<Navigate to="/cadastros/lotes/novo" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}