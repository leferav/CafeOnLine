import { Link, useParams } from "react-router-dom";

function carregarCompra(id) {
  const compras = JSON.parse(localStorage.getItem("comprasCafeOnline") || "[]");
  return compras.find((compra) => compra.id === id);
}

function atualizarStatusCompra(id, novoStatus) {
  const compras = JSON.parse(localStorage.getItem("comprasCafeOnline") || "[]");

  const atualizadas = compras.map((compra) =>
    compra.id === id
      ? {
          ...compra,
          status: novoStatus,
          updatedAt: new Date().toISOString(),
        }
      : compra
  );

  localStorage.setItem("comprasCafeOnline", JSON.stringify(atualizadas));

  return atualizadas.find((compra) => compra.id === id);
}

export default function ProsseguirCompra() {
  const { id } = useParams();
  const compra = carregarCompra(id);

  if (!compra) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Compra não encontrada</h2>
        <p className="muted">Não foi possível localizar os dados desta compra no navegador atual.</p>
        <Link className="btn-link" to="/compras">← Voltar para compras</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card"><h2 style={{ margin: 0 }}>Prosseguir com a compra</h2><div className="muted">Status: {compra.status}</div></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Dados do comprador</h3><p><strong>Cliente:</strong> {compra.buyerName}<br /><strong>E-mail:</strong> {compra.buyerEmail}<br /><strong>Data:</strong> {new Date(compra.createdAt).toLocaleString()}</p></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Lotes da negociação</h3><div style={{ display: "grid", gap: 12 }}>{compra.items.map((item) => (<div key={item.lotId} style={{ border: "1px solid #e7e1dc", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}><strong>{item.lotName}</strong><div className="muted">{item.internalCode}</div><div>Quantidade: {item.quantity} sacas</div><div>Preço por saca: {item.currency} {Number(item.unitPrice || 0).toFixed(2)}</div><div><strong>Subtotal: {item.currency} {Number(item.subtotal || 0).toFixed(2)}</strong></div></div>))}</div><div style={{ marginTop: 16, fontSize: 22, fontWeight: 700 }}>Total geral: {compra.currency} {Number(compra.total || 0).toFixed(2)}</div></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Próximos passos</h3><p className="muted">Esta tela será usada para continuar o processo de compra do lote. No MVP, os dados estão salvos localmente no navegador. Com backend, serão carregados pela API.</p><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button type="button" className="btn-link">Confirmar dados</button><button type="button" className="btn-link">Gerar documento da negociação</button><Link className="btn-link" to="/compras">← Voltar para compras</Link></div></div>
    </div>
  );
}
