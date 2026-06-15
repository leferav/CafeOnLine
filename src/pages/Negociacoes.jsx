import { Link } from "react-router-dom";

function carregarNegociacoes() {
  return JSON.parse(localStorage.getItem("comprasCafeOnline") || "[]");
}

function salvarNegociacoes(negociacoes) {
  localStorage.setItem("comprasCafeOnline", JSON.stringify(negociacoes));
}

function atualizarStatus(id, novoStatus) {
  const negociacoes = carregarNegociacoes();

  const atualizadas = negociacoes.map((negociacao) =>
    negociacao.id === id
      ? {
          ...negociacao,
          status: novoStatus,
          updatedAt: new Date().toISOString(),
        }
      : negociacao
  );

  salvarNegociacoes(atualizadas);
  window.location.reload();
}

function getStatusLabel(status) {
  const labels = {
    SOLICITADA: "Solicitada",
    COMPRA_ACEITA: "Compra aceita",
    PEDIDO_ACEITO: "Pedido aceito",
    PEDIDO_RECUSADO: "Pedido recusado",
    FINALIZADA: "Finalizada",
  };

  return labels[status] || status || "-";
}

function getPrimeiroItem(negociacao) {
  return negociacao.items?.[0] || {};
}

export default function Negociacoes() {
  const negociacoes = carregarNegociacoes();

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Negociações</h2>
            <div className="muted">
              Acompanhe as solicitações de compra dos lotes de café.
            </div>
          </div>

          <Link className="btn-link" to="/compras">
            + Nova compra
          </Link>
        </div>
      </div>

      <div className="card">
        {negociacoes.length === 0 ? (
          <div>
            <p className="muted">Nenhuma negociação encontrada.</p>
            <Link className="btn-link" to="/compras">
              Solicitar primeira compra
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Lote</th>
                  <th>Comprador</th>
                  <th>Quantidade</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {negociacoes.map((negociacao) => {
                  const item = getPrimeiroItem(negociacao);

                  return (
                    <tr key={negociacao.id}>
                      <td>
                        {negociacao.createdAt
                          ? new Date(negociacao.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        <strong>{item.lotName || "-"}</strong>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {item.internalCode || "-"}
                        </div>
                      </td>

                      <td>
                        {negociacao.buyerName || "-"}
                        <div className="muted" style={{ fontSize: 12 }}>
                          {negociacao.buyerEmail || "-"}
                        </div>
                      </td>

                      <td>{item.quantity || 0} sacas</td>

                      <td>
                        <strong>
                          {negociacao.currency || "USD"}{" "}
                          {Number(negociacao.total || 0).toFixed(2)}
                        </strong>
                      </td>

                      <td>{getStatusLabel(negociacao.status)}</td>

                      <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <Link
                          className="btn-link"
                          to={`/compras/${negociacao.id}/prosseguir`}
                        >
                          Visualizar
                        </Link>

                        {negociacao.status === "SOLICITADA" && (
                          <>
                            <button
                              type="button"
                              className="btn-link"
                              onClick={() => atualizarStatus(negociacao.id, "PEDIDO_ACEITO")}
                              style={{ border: 0, cursor: "pointer" }}
                            >
                              Aceitar
                            </button>

                            <button
                              type="button"
                              className="btn-link"
                              onClick={() => atualizarStatus(negociacao.id, "PEDIDO_RECUSADO")}
                              style={{ border: 0, cursor: "pointer" }}
                            >
                              Recusar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
