import { Link, useParams } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import { getLotById } from "../lib/storage";

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

    const salesModeLabel = lot.offer?.salesMode === "container"
        ? "Contêiner"
        : "Saca";

    const currency = lot.offer?.currency || "USD";
    const pricePerSack = Number(lot.offer?.pricePerSack || 0);
    const description =
        lang === "en"
            ? (lot.description?.en || lot.description?.pt || "")
            : lang === "es"
                ? (lot.description?.es || lot.description?.pt || "")
                : (lot.description?.pt || "");

    return (
        <div style={{ display: "grid", gap: 16 }}>
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                        <h2 style={{ margin: 0 }}>{lot.lotName || "-"}</h2>
                        <div className="muted">{lot.internalCode || ""}</div>
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Link className="btn-link" to={`/compras?lotId=${lot.id}`}>
                            Comprar este lote
                        </Link>
                        <Link className="btn-link" to={`/lotes/${lot.id}/editar`}>
                            {t("edit")}
                        </Link>
                        <Link className="btn-link" to="/lotes">
                            ← {t("lots")}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0 }}>Resumo comercial</h3>

                <div
                    style={{
                        marginTop: 12,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 12,
                    }}
                >
                    <div>
                        <strong>Região:</strong> {lot.region || "-"}<br />
                        <strong>Armazém origem:</strong> {lot.originWarehouse || "-"}<br />
                        <strong>Armazém disponível:</strong> {lot.availableWarehouse || "-"}
                    </div>

                    <div>
                        <strong>Embalagem:</strong> {lot.packaging?.type || "-"}<br />
                        <strong>Venda por:</strong> {salesModeLabel}<br />
                        <strong>Embarque:</strong> {lot.offer?.ship?.shipMonth || "-"}
                    </div>

                    <div>
                        <strong>Quantidade mínima:</strong> {lot.offer?.quantityMin || "-"}<br />
                        <strong>Quantidade disponível:</strong> {lot.offer?.quantityAvailable || "-"}<br />
                        <strong>Preço por saca:</strong> {currency} {pricePerSack.toFixed(2)}
                    </div>

                    <div>
                        <strong>Nota SCA:</strong> {Number(lot.sca?.totalScore || 0).toFixed(1)}<br />
                        <strong>Origem:</strong> Brasil
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0 }}>Descrição</h3>
                <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>
                    {description || "Sem descrição cadastrada."}
                </p>
            </div>
        </div>
    );
}
