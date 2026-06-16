import { Link, useLocation, useParams } from "react-router-dom";
import { useI18n } from "../../../i18n/i18n.jsx";
import { useAuth } from "../../../auth/AuthContext";
import { PERMISSOES } from "../../../auth/AuthContext";
import {
  obterContextoLotes,
  obterRotasLotes,
  ROTAS_LOTES,
} from "../../../auth/routes";
import { getLotById, isLotDisponivelParaCompra, LOTE_STATUS, normalizarStatusLote } from "../../../lib/storage.js";

export default function DetalheLote() {
    const { id } = useParams();
    const location = useLocation();
    const { temPermissao } = useAuth();
    const { t, lang } = useI18n();
    const rotas = obterRotasLotes(location.pathname);
    const isCompra = obterContextoLotes(location.pathname) === "compra";
    const lot = getLotById(id);

    if (!lot) {
        return (
            <div className="card">
                <p className="muted">{t("detalheLote.notFound")}</p>
                <Link className="btn-secondary" to={rotas.lista}>← {t("lots")}</Link>
            </div>
        );
    }

    if (isCompra && !isLotDisponivelParaCompra(lot)) {
        return (
            <div className="card">
                <p className="muted">{t("loteStatus.notAvailableAnymore")}</p>
                <Link className="btn-secondary" to={rotas.lista}>← {t("lots")}</Link>
            </div>
        );
    }

    const salesModeLabel = lot.offer?.salesMode === "container"
        ? t("detalheLote.container")
        : t("detalheLote.sack");

    const currency = lot.offer?.currency || "USD";
    const pricePerSack = Number(lot.offer?.pricePerSack || 0);
    const description =
        lang === "en"
            ? (lot.description?.en || lot.description?.pt || "")
            : lang === "es"
                ? (lot.description?.es || lot.description?.pt || "")
                : (lot.description?.pt || "");

    const podeEditar = !isCompra && temPermissao(PERMISSOES.NOVO_LOTE);
    const podeComprar = temPermissao(PERMISSOES.COMPRAS) && isLotDisponivelParaCompra(lot);
    const vendido = normalizarStatusLote(lot) === LOTE_STATUS.VENDIDO;

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{lot.lotName || "-"}</h2>
                        <div className="muted">{lot.internalCode || ""}</div>
                        {vendido && (
                            <div style={{ marginTop: 8, fontWeight: 700, color: "#7a421f" }}>
                                {t("loteStatus.vendido")}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {podeComprar && (
                            <Link className="btn-primary" to={`/compras?lotId=${lot.id}`}>
                                {t("detalheLote.buyLot")}
                            </Link>
                        )}
                        {podeEditar && (
                            <Link
                                className="btn-outline"
                                to={ROTAS_LOTES.cadastro.editar(lot.id)}
                            >
                                {t("edit")}
                            </Link>
                        )}
                        <Link className="btn-secondary" to={rotas.lista}>
                            ← {t("lots")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0 }}>{t("detalheLote.commercialSummary")}</h3>

                <div
                    style={{
                        marginTop: 12,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 12,
                    }}
                >
                    <div>
                        <strong>{t("detalheLote.region")}:</strong> {lot.region || "-"}<br />
                        <strong>{t("detalheLote.originWarehouse")}:</strong> {lot.originWarehouse || "-"}<br />
                        <strong>{t("detalheLote.availableWarehouse")}:</strong> {lot.availableWarehouse || "-"}
                    </div>

                    <div>
                        <strong>{t("detalheLote.packaging")}:</strong> {lot.packaging?.type || "-"}<br />
                        <strong>{t("detalheLote.salesBy")}:</strong> {salesModeLabel}<br />
                        <strong>{t("detalheLote.shipping")}:</strong> {lot.offer?.ship?.shipMonth || "-"}
                    </div>

                    <div>
                        <strong>{t("detalheLote.minQty")}:</strong> {lot.offer?.quantityMin || "-"}<br />
                        <strong>{t("detalheLote.availableQty")}:</strong> {lot.offer?.quantityAvailable || "-"}<br />
                        <strong>{t("detalheLote.pricePerSack")}:</strong> {currency} {pricePerSack.toFixed(2)}
                    </div>

                    <div>
                        <strong>{t("detalheLote.scaScore")}:</strong> {Number(lot.sca?.totalScore || 0).toFixed(1)}<br />
                        <strong>{t("detalheLote.originCountry")}:</strong> {t("detalheLote.brazil")}
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0 }}>{t("detalheLote.description")}</h3>
                <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
                    {description || t("detalheLote.noDescription")}
                </p>
            </div>
        </div>
    );
}
