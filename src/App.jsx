import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Lotes from "./pages/Lotes.jsx";
import NovoLote from "./pages/NovoLote.jsx";
import EditarLote from "./pages/EditarLote.jsx";
import DetalheLote from "./pages/DetalheLote.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lotes" element={<Lotes />} />
          <Route path="/lotes/novo" element={<NovoLote />} />
            <Route path="/lotes/:id" element={<DetalheLote />} />
            <Route path="/lotes/:id/editar" element={<EditarLote />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
