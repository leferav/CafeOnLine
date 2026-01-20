import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { getLotById } from "../lib/storage";
import SCAChart from "../components/SCAChart/SCAChart";
import { sumDiff, computeTotals, convertCurrency, nyMockUsd } from "../lib/pricing";

export default function DetalheLote() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const lot = getLotById(id);

  if (!lot) {
    return (
      <div className="card">
        <p className="muted">Lote não encontrado.</p>
        <Link className="btn-link" to="/lotes">← {t("lots")}</Link>
      </div>
    );
  }

  const finalDiff = sumDiff(lot.pricing || {});
  const nyBase = lot.pricing?.nyBaseUsdPerLb ?? (nyMockUsd[(lot.offer?.ship?.nyMonth || "Jan").slice(0,3)] ?? 0);
  const totals = computeTotals({ nyBaseUsdPerLb: nyBase, finalDiffUsdPerLb: finalDiff });

  const currency = lot.pricing?.displayCurrency || "USD";
  const totalConverted = convertCurrency(totals.perSack60, currency);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{lot.lotName || "-"}</h2>
            <div className="muted">{lot.internalCode || ""}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn-link" to={`/lotes/${lot.id}/editar`}>{t("edit")}</Link>
            <Link className="btn-link" to="/lotes">← {t("lots")}</Link>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div>
            <strong>{t("region")}:</strong> {lot.region || "-"}<br/>
            <strong>{t("originWarehouse")}:</strong> {lot.originWarehouse || "-"}<br/>
            <strong>{t("availableWarehouse")}:</strong> {lot.availableWarehouse || "-"}
          </div>
          <div>
            <strong>{t("packaging")}:</strong> {lot.packaging?.type || "-"}{lot.packaging?.withGP ? " + GP" : ""}<br/>
            <strong>{t("salesMode")}:</strong> {lot.offer?.salesMode === "container" ? t("salesModeContainer") : t("salesModeSack")}
          </div>
          <div>
            <strong>{t("finalDiff")}:</strong> {finalDiff.toFixed(2)}<br/>
            <strong>{t("perSack60")}:</strong> USD {totals.perSack60.toFixed(2)}<br/>
            <strong>{t("totalConverted")}:</strong> {currency} {totalConverted.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("sectionDescription")}</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {lang === "en" ? (lot.description?.en || "") : (lot.description?.pt || "")}
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("sectionSCA")}</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <SCAChart data={lot.sca?.chartData || []} />
          <div>
            <div><strong>{t("scaTotal")}:</strong> {(lot.sca?.totalScore ?? 0).toFixed(2)}</div>
            <div className="muted" style={{ marginTop: 6, maxWidth: 380 }}>
              O radar mostra os atributos (0–10). A nota final é uma soma aproximada para referência visual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
