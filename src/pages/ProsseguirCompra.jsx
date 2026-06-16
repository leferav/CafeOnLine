import { Navigate, useParams, useSearchParams } from "react-router-dom";

/** Mantém links antigos do e-mail; redireciona para Negociações com a mesma compra. */
export default function ProsseguirCompra() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const d = searchParams.get("d");

  let destino = `/negociacoes?compra=${encodeURIComponent(id)}`;
  if (d) destino += `&d=${encodeURIComponent(d)}`;

  return <Navigate to={destino} replace />;
}
