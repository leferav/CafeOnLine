import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../../i18n/i18n.jsx";
import { useAuth } from "../../../auth/AuthContext";
import { PERMISSOES } from "../../../auth/AuthContext";
import { obterContextoLotes, obterRotasLotes } from "../../../auth/routes";
import {
  loadLots,
  loadLotsDisponiveisParaCompra,
  LOTE_STATUS,
  normalizarStatusLote,
} from "../../../lib/storage.js";

export default function Lotes() {
  const { t } = useI18n();
  const { temPermissao } = useAuth();
  const location = useLocation();
  const rotas = obterRotasLotes(location.pathname);
  const isCompra = obterContextoLotes(location.pathname) === "compra";
  const lots = isCompra ? loadLotsDisponiveisParaCompra() : loadLots();
  const podeCriar = temPermissao(PERMISSOES.NOVO_LOTE) && rotas.novo;
  const podeEditar = temPermissao(PERMISSOES.NOVO_LOTE) && rotas.editar;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>{t("lots")}</h2>
          <div className="muted">{lots.length === 1 ? t("oneLot") : t("lotsCount", { count: lots.length })}</div>
        </div>

        {podeCriar && (
          <Link to={rotas.novo} className="btn-primary">+ {t("newLot")}</Link>
        )}
      </div>

      {lots.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <p className="muted">{t("emptyLots")}</p>
          {podeCriar && (
            <Link to={rotas.novo} className="btn-primary">{t("createFirstLot")}</Link>
          )}
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
                {!isCompra && <th>{t("loteStatus.column")}</th>}
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
                  <td>{lot.packaging?.type || "-"}</td>
                  <td>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {lot.offer?.spot ? t("spot") : ""}
                      {lot.offer?.ship?.enabled
                        ? t("detalheLote.shipInfo", {
                            ship: lot.offer.ship.shipMonth || "-",
                            ny: lot.offer.ship.nyMonth || "-",
                          })
                        : ""}
                    </div>
                  </td>
                  {!isCompra && (
                    <td>
                      {normalizarStatusLote(lot) === LOTE_STATUS.VENDIDO
                        ? t("loteStatus.vendido")
                        : t("loteStatus.disponivel")}
                    </td>
                  )}
                  <td className="table-actions">
                    <Link to={rotas.detalhe(lot.id)} className="btn-secondary btn-sm">{t("view")}</Link>
                    {podeEditar && (
                      <Link to={rotas.editar(lot.id)} className="btn-outline btn-sm">{t("edit")}</Link>
                    )}
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
