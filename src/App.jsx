import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Lotes from "./pages/Lotes.jsx";
import NovoLote from "./pages/NovoLote.jsx";
import EditarLote from "./pages/EditarLote.jsx";
import DetalheLote from "./pages/DetalheLote.jsx";
import Compras from "./pages/Compras";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/cadastros" element={<Navigate to="/lotes/novo" replace />} />
          <Route path="/cadastros/lotes/novo" element={<Navigate to="/lotes/novo" replace />} />

          <Route path="/vendas" element={<Navigate to="/compras" replace />} />
          <Route path="/compras" element={<Compras />} />

          <Route path="/lotes" element={<Lotes />} />
          <Route path="/lotes/novo" element={<NovoLote />} />
          <Route path="/lotes/:id" element={<DetalheLote />} />
          <Route path="/lotes/:id/editar" element={<EditarLote />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
