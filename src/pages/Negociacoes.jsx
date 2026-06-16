import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";

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

function getPrimeiroItem(negociacao) {
  return negociacao.items?.[0] || {};
}

export default function Negociacoes() {
  const { t } = useI18n();
  const negociacoes = carregarNegociacoes();

  function getStatusLabel(status) {
    const map = {
      SOLICITADA: "negociacoes.statusSolicitada",
      COMPRA_ACEITA: "negociacoes.statusCompraAceita",
      PEDIDO_ACEITO: "negociacoes.statusPedidoAceito",
      PEDIDO_RECUSADO: "negociacoes.statusPedidoRecusado",
      FINALIZADA: "negociacoes.statusFinalizada",
    };
    return t(map[status] || status || "-");
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{t("negociacoes.title")}</h2>
            <div className="muted">{t("negociacoes.subtitle")}</div>
          </div>

          <Link className="btn-link" to="/compras">
            {t("negociacoes.newPurchase")}
          </Link>
        </div>
      </div>

      <div className="card">
        {negociacoes.length === 0 ? (
          <div>
            <p className="muted">{t("negociacoes.empty")}</p>
            <Link className="btn-link" to="/compras">
              {t("negociacoes.firstPurchase")}
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>{t("negociacoes.date")}</th>
                  <th>{t("negociacoes.lot")}</th>
                  <th>{t("negociacoes.buyer")}</th>
                  <th>{t("negociacoes.quantity")}</th>
                  <th>{t("negociacoes.value")}</th>
                  <th>{t("negociacoes.status")}</th>
                  <th>{t("negociacoes.actions")}</th>
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

                      <td>{item.quantity || 0} {t("sacks")}</td>

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
                          {t("negociacoes.view")}
                        </Link>

                        {negociacao.status === "SOLICITADA" && (
                          <>
                            <button
                              type="button"
                              className="btn-link"
                              onClick={() => atualizarStatus(negociacao.id, "PEDIDO_ACEITO")}
                              style={{ border: 0, cursor: "pointer" }}
                            >
                              {t("negociacoes.accept")}
                            </button>

                            <button
                              type="button"
                              className="btn-link"
                              onClick={() => atualizarStatus(negociacao.id, "PEDIDO_RECUSADO")}
                              style={{ border: 0, cursor: "pointer" }}
                            >
                              {t("negociacoes.reject")}
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
