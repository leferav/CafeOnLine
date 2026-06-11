import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./auth/ProtectedRoute";

import Home from "./pages/Home.jsx";
import Compras from "./pages/Compras";

// Tela principal de Cadastros
import Cadastros from "./pages/Cadastro/Cadastros.jsx";

// Lotes
import Lotes from "./pages/Cadastro/Lote/Lotes.jsx";
import NovoLote from "./pages/Cadastro/Lote/NovoLote.jsx";
import EditarLote from "./pages/Cadastro/Lote/EditarLote.jsx";
import DetalheLote from "./pages/Cadastro/Lote/DetalheLote.jsx";

// Outros cadastros
import Clientes from "./pages/Cadastro/Cliente/Clientes.jsx";
import NovoCliente from "./pages/Cadastro/Cliente/NovoCliente.jsx";
import EditarCliente from "./pages/Cadastro/Cliente/EditarCliente.jsx";

// import Origens from "./pages/Cadastro/Origem/Origens.jsx";
// import Variedades from "./pages/Cadastro/Variedade/Variedades.jsx";
// import Safras from "./pages/Cadastro/Safra/Safras.jsx";
// import Fornecedores from "./pages/Cadastro/Fornecedor/Fornecedores.jsx";

export default function App() {
  return (
      <>
        <Navbar />

        <main className="page">
          <Routes>
            <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
            />
            <Route path="/login" element={<Login />} />

            {/* Cadastros */}
            <Route
                path="/cadastros"
                element={
                  <ProtectedRoute>
                    <Cadastros />
                  </ProtectedRoute>
                }
            />

            {/* Lotes */}
            <Route
                path="/cadastros/lotes"
                element={
                  <ProtectedRoute>
                    <Lotes />
                  </ProtectedRoute>
                }
            />
            <Route path="/cadastros/lotes/novo" element={<NovoLote />} />
            <Route path="/cadastros/lotes/:id" element={<DetalheLote />} />
            <Route path="/cadastros/lotes/:id/editar" element={<EditarLote />} />

            {/* Clientes */}
            <Route
                path="/cadastros/clientes"
                element={
                  <ProtectedRoute>
                    <Clientes />
                  </ProtectedRoute>
                }
            />
            <Route path="/cadastros/clientes/novo" element={<NovoCliente />} />
            <Route path="/cadastros/clientes/:id/editar" element={<EditarCliente />} />

            {/* Futuros */}
            {/* <Route path="/cadastros/origens" element={<Origens />} /> */}
            {/* <Route path="/cadastros/variedades" element={<Variedades />} /> */}
            {/* <Route path="/cadastros/safras" element={<Safras />} /> */}
            {/* <Route path="/cadastros/fornecedores" element={<Fornecedores />} /> */}

            {/* Vendas */}
            <Route path="/vendas" element={<Navigate to="/compras" replace />} />
            <Route
                path="/compras"
                element={
                  <ProtectedRoute>
                    <Compras />
                  </ProtectedRoute>
                }
            />

            {/* Compatibilidade com links antigos */}
            <Route path="/lotes" element={<Navigate to="/cadastros/lotes" replace />} />
            <Route path="/lotes/novo" element={<Navigate to="/cadastros/lotes/novo" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </>
  );
}