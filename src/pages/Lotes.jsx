import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { loadLots, upsertLot } from "../lib/storage";

function duplicateLot(lot) {
  const copy = {
    ...lot,
    id: crypto.randomUUID(),
    internalCode: (lot.internalCode || "LOTE") + "-COPIA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  upsertLot(copy);
}

export default function Lotes() {
  const { t } = useI18n();
  const lots = loadLots();

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>{t("lots")}</h2>
          <div className="muted">{lots.length} {lots.length === 1 ? "lote" : "lotes"}</div>
        </div>

        <Link to="/lotes/novo" className="btn-link">+ {t("newLot")}</Link>
      </div>

      {lots.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <p className="muted">{t("emptyLots")}</p>
          <Link to="/lotes/novo" className="btn-link">{t("createFirstLot")}</Link>
        </div>
      ) : (
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>{t("internalCode")}</th>
                <th>{t("lotName")}</th>
                <th>{t("region")}</th>
                <th>{t("packaging")}</th>
                <th>{t("sectionOffer")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id}>
                  <td>{lot.internalCode || "-"}</td>
                  <td>
                    <div><strong>{lot.lotName || "-"}</strong></div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {lot.updatedAt ? new Date(lot.updatedAt).toLocaleString() : ""}
                    </div>
                  </td>
                  <td>{lot.region || "-"}</td>
                  <td>{lot.packaging?.type || "-"}{lot.packaging?.withGP ? " + GP" : ""}</td>
                  <td>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {lot.offer?.spot ? "Spot" : ""}
                      {lot.offer?.ship?.enabled ? ` • Embarque: ${lot.offer.ship.shipMonth || "-"} • NY: ${lot.offer.ship.nyMonth || "-"}` : ""}
                    </div>
                  </td>
                  <td style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Link to={`/lotes/${lot.id}`} className="btn-link">{t("view")}</Link>
                    <Link to={`/lotes/${lot.id}/editar`} className="btn-link">{t("edit")}</Link>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => duplicateLot(lot)}
                      style={{ border: 0, cursor: "pointer" }}
                    >
                      {t("duplicate")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
