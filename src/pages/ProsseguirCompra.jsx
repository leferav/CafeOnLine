import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n/i18n";

function carregarCompra(id) {
  const compras = JSON.parse(localStorage.getItem("comprasCafeOnline") || "[]");
  return compras.find((compra) => compra.id === id);
}

export default function ProsseguirCompra() {
  const { id } = useParams();
  const { t } = useI18n();
  const compra = carregarCompra(id);

  if (!compra) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{t("prosseguir.notFoundTitle")}</h2>
        <p className="muted">{t("prosseguir.notFoundText")}</p>
        <Link className="btn-link" to="/compras">{t("prosseguir.backCompras")}</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <h2 style={{ margin: 0 }}>{t("prosseguir.title")}</h2>
        <div className="muted">{t("prosseguir.statusLabel", { status: compra.status })}</div>
      </div>

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
          {compra.items.map((item) => (
            <div key={item.lotId} style={{ border: "1px solid #e7e1dc", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
              <strong>{item.lotName}</strong>
              <div className="muted">{item.internalCode}</div>
              <div>{t("prosseguir.quantity", { qty: item.quantity })}</div>
              <div>{t("prosseguir.pricePerSack", { currency: item.currency, price: Number(item.unitPrice || 0).toFixed(2) })}</div>
              <div><strong>{t("prosseguir.subtotal", { currency: item.currency, total: Number(item.subtotal || 0).toFixed(2) })}</strong></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 22, fontWeight: 700 }}>
          {t("prosseguir.grandTotal", { currency: compra.currency, total: Number(compra.total || 0).toFixed(2) })}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("prosseguir.nextSteps")}</h3>
        <p className="muted">{t("prosseguir.nextStepsText")}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn-link">{t("prosseguir.confirmData")}</button>
          <button type="button" className="btn-link">{t("prosseguir.generateDoc")}</button>
          <Link className="btn-link" to="/compras">{t("prosseguir.backCompras")}</Link>
        </div>
      </div>
    </div>
  );
}
