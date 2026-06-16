import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PERMISSOES } from "../auth/AuthContext";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/i18n";
import CompraDetalhe from "../components/CompraDetalhe/CompraDetalhe";
import { getStatusLabel } from "../lib/compraStatus";
import {
  CANAL_ACEITE,
  COMPRA_STATUS,
  COMPRAS_STORAGE_KEY,
  COMPRAS_UPDATED_EVENT,
  aceitarCompra,
  getCompraById,
  importarCompraDeUrlParam,
  listarComprasPendentes,
  loadCompras,
  obterResumoNegociacao,
  recusarCompra,
} from "../lib/comprasStorage";

function podeGerenciarAceite(temPermissao, compra) {
  if (compra.status !== COMPRA_STATUS.SOLICITADA) return false;
  return temPermissao(PERMISSOES.VENDAS);
}

function getCanalLabel(t, canal) {
  if (canal === CANAL_ACEITE.SISTEMA) return t("aceite.canalSistema");
  if (canal === CANAL_ACEITE.EMAIL) return t("aceite.canalEmail");
  return canal || "-";
}

export default function Negociacoes() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { temPermissao, usuario } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("compra") || "";
  const showDetail = searchParams.get("view") === "1";
  const [negociacoes, setNegociacoes] = useState(() => loadCompras());
  const [fromEmailLink, setFromEmailLink] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const highlightedRowRef = useRef(null);

  useEffect(() => {
    function refreshNegociacoes() {
      setNegociacoes(loadCompras());
    }

    refreshNegociacoes();

    function onStorage(event) {
      if (event.key === COMPRAS_STORAGE_KEY) refreshNegociacoes();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") refreshNegociacoes();
    }

    window.addEventListener(COMPRAS_UPDATED_EVENT, refreshNegociacoes);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refreshNegociacoes);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener(COMPRAS_UPDATED_EVENT, refreshNegociacoes);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refreshNegociacoes);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setNegociacoes(loadCompras());
  }, [location.pathname, location.search]);

  useEffect(() => {
    const encoded = searchParams.get("d");

    if (encoded) {
      const importada = importarCompraDeUrlParam(encoded);
      if (importada) {
        setNegociacoes(loadCompras());
        setFromEmailLink(true);
        navigate(`/negociacoes?compra=${importada.id}`, { replace: true });
        return;
      }
    }

    setFeedback(null);
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!selectedId || showDetail) return;
    highlightedRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedId, showDetail, negociacoes.length]);

  const selectedCompra = useMemo(() => {
    if (!selectedId) return null;
    return negociacoes.find((n) => n.id === selectedId) ?? getCompraById(selectedId);
  }, [negociacoes, selectedId]);

  const canalAceite = fromEmailLink ? CANAL_ACEITE.EMAIL : CANAL_ACEITE.SISTEMA;

  function handleAceitar(id, canal = canalAceite) {
    const atualizada = aceitarCompra(id, usuario, canal);
    if (!atualizada) return;
    setNegociacoes((prev) => prev.map((n) => (n.id === id ? atualizada : n)));
    if (selectedId === id && showDetail) setFeedback(t("aceite.acceptSuccess"));
    return atualizada;
  }

  function handleRecusar(id, canal = canalAceite) {
    const atualizada = recusarCompra(id, usuario, canal);
    if (!atualizada) return;
    setNegociacoes((prev) => prev.map((n) => (n.id === id ? atualizada : n)));
    if (selectedId === id && showDetail) setFeedback(t("aceite.rejectSuccess"));
    return atualizada;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{t("negociacoes.title")}</h2>
            <div className="muted">{t("negociacoes.subtitle")}</div>
          </div>

          <Link className="btn-primary" to="/compras">
            {t("negociacoes.newPurchase")}
          </Link>
        </div>
      </div>

      {fromEmailLink && selectedCompra && !showDetail && (
        <div
          className="card"
          style={{ border: "1px solid #c9b5a5", background: "#faf6f2", padding: "12px 16px" }}
        >
          <p style={{ margin: 0, fontSize: 14 }}>{t("negociacoes.emailImportedHint")}</p>
        </div>
      )}

      {selectedId && !selectedCompra && !searchParams.get("d") && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t("prosseguir.notFoundTitle")}</h3>
          <p className="muted">{t("prosseguir.notFoundText")}</p>
          <p className="muted" style={{ fontSize: 13 }}>{t("prosseguir.notFoundHint")}</p>

          {listarComprasPendentes().length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ margin: "0 0 10px", fontSize: 15 }}>{t("prosseguir.pendingListTitle")}</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {listarComprasPendentes().map((pendente) => (
                  <Link
                    key={pendente.id}
                    className="btn-outline btn-sm"
                    to={`/negociacoes?compra=${pendente.id}`}
                  >
                    {pendente.buyerName || pendente.id}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showDetail && selectedCompra && (
        <CompraDetalhe
          compra={selectedCompra}
          feedback={feedback}
          gerenciaAceite={podeGerenciarAceite(temPermissao, selectedCompra)}
          showEmailContext={fromEmailLink}
          onAceitar={() => handleAceitar(selectedId)}
          onRecusar={() => handleRecusar(selectedId)}
        />
      )}

      <div className="card">
        {negociacoes.length === 0 ? (
          <div>
            <p className="muted">{t("negociacoes.empty")}</p>
            <Link className="btn-primary" to="/compras">
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
                  const { items, totalSacks, lotsCount, first } = obterResumoNegociacao(negociacao);
                  const gerenciaAceite = podeGerenciarAceite(temPermissao, negociacao);
                  const isSelected = negociacao.id === selectedId;

                  return (
                    <tr
                      key={negociacao.id}
                      ref={isSelected ? highlightedRowRef : undefined}
                      style={
                        isSelected
                          ? { background: "#faf6f2", outline: "2px solid #c9b5a5" }
                          : undefined
                      }
                    >
                      <td>
                        {negociacao.createdAt
                          ? new Date(negociacao.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {lotsCount > 1 ? (
                          <>
                            <strong>{t("negociacoes.multipleLotsLabel", { count: lotsCount })}</strong>
                            <div className="muted" style={{ fontSize: 12 }}>
                              {items.map((i) => i.lotName || i.internalCode).join(" · ")}
                            </div>
                          </>
                        ) : (
                          <>
                            <strong>{first.lotName || "-"}</strong>
                            <div className="muted" style={{ fontSize: 12 }}>
                              {first.internalCode || "-"}
                            </div>
                          </>
                        )}
                      </td>

                      <td>
                        {negociacao.buyerName || "-"}
                        <div className="muted" style={{ fontSize: 12 }}>
                          {negociacao.buyerEmail || "-"}
                        </div>
                      </td>

                      <td>{totalSacks} {t("sacks")}</td>

                      <td>
                        <strong>
                          {negociacao.currency || "USD"}{" "}
                          {Number(negociacao.total || 0).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        {getStatusLabel(t, negociacao.status)}
                        {negociacao.aceite?.canal && (
                          <div className="muted" style={{ fontSize: 12 }}>
                            {getCanalLabel(t, negociacao.aceite.canal)}
                          </div>
                        )}
                      </td>

                      <td className="table-actions">
                        <Link
                          className={`btn-secondary btn-sm ${isSelected && showDetail ? "is-active" : ""}`}
                          to={`/negociacoes?compra=${negociacao.id}&view=1`}
                        >
                          {t("negociacoes.view")}
                        </Link>

                        {gerenciaAceite && (
                          <>
                            <button
                              type="button"
                              className="btn-success btn-sm"
                              onClick={() => handleAceitar(negociacao.id)}
                            >
                              {t("negociacoes.accept")}
                            </button>

                            <button
                              type="button"
                              className="btn-danger btn-sm"
                              onClick={() => handleRecusar(negociacao.id)}
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
