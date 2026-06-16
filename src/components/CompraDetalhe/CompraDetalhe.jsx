import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/i18n";
import { getStatusLabel } from "../../lib/compraStatus";
import { CANAL_ACEITE } from "../../lib/comprasStorage";

function getCanalLabel(t, canal) {
  if (canal === CANAL_ACEITE.SISTEMA) return t("aceite.canalSistema");
  if (canal === CANAL_ACEITE.EMAIL) return t("aceite.canalEmail");
  return canal || "-";
}

export default function CompraDetalhe({
  compra,
  feedback,
  gerenciaAceite,
  showEmailContext,
  onAceitar,
  onRecusar,
}) {
  const { t } = useI18n();
  const items = compra.items ?? [];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card" style={{ border: "1px solid #c9b5a5", background: "#faf6f2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: "0 0 6px" }}>{t("negociacoes.detailTitle")}</h3>
            <div className="muted">
              {t("prosseguir.statusLabel", { status: getStatusLabel(t, compra.status) })}
            </div>
            {feedback && (
              <p style={{ margin: "12px 0 0", color: "#5a3e2b", fontWeight: 700 }}>{feedback}</p>
            )}
          </div>
          <Link className="btn-ghost btn-sm" to={`/negociacoes?compra=${compra.id}`}>
            {t("negociacoes.closeDetail")}
          </Link>
        </div>
      </div>

      {gerenciaAceite && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t("aceite.title")}</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            {showEmailContext ? t("aceite.emailLinkSubtitle") : t("aceite.systemSubtitle")}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="btn-success" onClick={onAceitar}>
              {t("negociacoes.accept")}
            </button>
            <button type="button" className="btn-danger" onClick={onRecusar}>
              {t("negociacoes.reject")}
            </button>
          </div>
          {showEmailContext && (
            <p className="muted" style={{ margin: "12px 0 0", fontSize: 13 }}>
              {t("aceite.emailHint")}
            </p>
          )}
        </div>
      )}

      {compra.aceite && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t("aceite.infoTitle")}</h3>
          <p>
            <strong>{t("aceite.canal")}:</strong> {getCanalLabel(t, compra.aceite.canal)}<br />
            <strong>{t("aceite.by")}:</strong> {compra.aceite.aceitoPorNome}<br />
            <strong>{t("aceite.email")}:</strong> {compra.aceite.aceitoPorEmail}<br />
            <strong>{t("aceite.date")}:</strong>{" "}
            {compra.aceite.aceitoEm
              ? new Date(compra.aceite.aceitoEm).toLocaleString()
              : "-"}
          </p>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("prosseguir.buyerData")}</h3>
        <p>
          <strong>{t("prosseguir.client")}:</strong> {compra.buyerName}<br />
          <strong>{t("prosseguir.email")}:</strong> {compra.buyerEmail}<br />
          <strong>{t("prosseguir.date")}:</strong> {new Date(compra.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("prosseguir.lotsTitle")}</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((item) => (
            <div
              key={item.lotId}
              style={{ border: "1px solid #e7e1dc", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}
            >
              <strong>{item.lotName}</strong>
              <div className="muted">{item.internalCode}</div>
              <div>{t("prosseguir.quantity", { qty: item.quantity })}</div>
              <div>
                {t("prosseguir.pricePerSack", {
                  currency: item.currency,
                  price: Number(item.unitPrice || 0).toFixed(2),
                })}
              </div>
              <div>
                <strong>
                  {t("prosseguir.subtotal", {
                    currency: item.currency,
                    total: Number(item.subtotal || 0).toFixed(2),
                  })}
                </strong>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 22, fontWeight: 700 }}>
          {t("prosseguir.grandTotal", {
            currency: compra.currency,
            total: Number(compra.total || 0).toFixed(2),
          })}
        </div>
      </div>
    </div>
  );
}
