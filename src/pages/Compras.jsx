import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ROTAS_LOTES } from "../auth/routes";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/i18n";
import { loadLotsDisponiveisParaCompra } from "../lib/storage";
import {
  COMPRA_STATUS,
  calcularTotaisCompra,
  consolidarItensCompra,
  montarLinkProsseguir,
  salvarCompra,
} from "../lib/comprasStorage";

function getLotQuantities(lot) {
  const available = Number(lot?.offer?.quantityAvailable || 0);
  const min = Number(lot.offer?.quantityMin || 1);
  return { available, min };
}

function quantityForPurchaseType(purchaseType, lot) {
  const { available, min } = getLotQuantities(lot);
  return purchaseType === "full" ? available : min;
}

function buildInitialItems(type, lotId, lots) {
  const selectedLotId = lotId || lots[0]?.id;
  if (!selectedLotId) return [];
  const selected = lots.find((lot) => lot.id === selectedLotId);
  if (!selected) return [];
  return [{ lotId: selected.id, quantity: quantityForPurchaseType(type, selected) }];
}

function mapItemsForPurchaseType(items, purchaseType, lots) {
  return items.map((item) => {
    const lot = lots.find((entry) => entry.id === item.lotId);
    if (!lot) return item;
    return { ...item, quantity: quantityForPurchaseType(purchaseType, lot) };
  });
}

function montarCorpoEmail(compra) {
  const itensTexto = compra.items.map((item) =>
`Lote: ${item.lotName}
Código interno: ${item.internalCode}
Quantidade: ${item.quantity} sacas
Preço por saca: ${item.currency} ${item.unitPrice.toFixed(2)}
Subtotal: ${item.currency} ${item.subtotal.toFixed(2)}`
  ).join("\n\n");

  return `Olá,

Foi enviada uma solicitação de compra no Café Online.

Dados da negociação:

Cliente comprador: ${compra.buyerName}
E-mail do comprador: ${compra.buyerEmail}
Status: ${compra.status}
Data da solicitação: ${new Date(compra.createdAt).toLocaleString()}

${itensTexto}

Total geral: ${compra.currency} ${compra.total.toFixed(2)}

Para aceitar ou recusar pelo sistema, acesse:
${compra.linkProsseguir}

Você também pode validar o aceite diretamente em Negociações no portal.

Atenciosamente,
Café Online`;
}

export default function Compras() {
  const { t } = useI18n();
  const { usuario } = useAuth();
  const lots = loadLotsDisponiveisParaCompra();
  const [searchParams] = useSearchParams();
  const preselectedLotId = searchParams.get("lotId") || "";
  const [purchaseType, setPurchaseType] = useState("partial");
  const [items, setItems] = useState(() => buildInitialItems("partial", preselectedLotId, lots));
  const [solicitacaoEnviada, setSolicitacaoEnviada] = useState(false);
  const [ultimaCompraId, setUltimaCompraId] = useState(null);

  const quantityErrors = useMemo(() => {
    if (purchaseType === "full") return {};

    const totalsByLot = {};
    items.forEach((item) => {
      totalsByLot[item.lotId] = (totalsByLot[item.lotId] || 0) + Number(item.quantity || 0);
    });

    const errors = {};
    items.forEach((item, index) => {
      const lot = lots.find((entry) => entry.id === item.lotId);
      if (!lot) return;

      const { available, min } = getLotQuantities(lot);
      const qty = Number(item.quantity || 0);
      const lotLabel = lot.lotName || lot.internalCode || t("compras.lot");
      const totalForLot = totalsByLot[item.lotId] || 0;

      if (totalForLot > available) {
        errors[index] = t("compras.errQtyExceedsAvailableTotal", {
          available,
          lotName: lotLabel,
          requested: totalForLot,
        });
      } else if (qty < min) {
        errors[index] = t("compras.errQtyBelowMin", { min, lotName: lotLabel });
      }
    });
    return errors;
  }, [items, lots, purchaseType, t]);

  function changePurchaseType(nextType) {
    if (nextType === purchaseType) return;

    setPurchaseType(nextType);
    setItems((prev) => {
      const wasMultiple = purchaseType === "multiple";
      const isSingleMode = nextType === "partial" || nextType === "full";

      if (wasMultiple && isSingleMode) {
        const lotId = preselectedLotId || lots[0]?.id;
        return lotId ? buildInitialItems(nextType, lotId, lots) : [];
      }

      if (prev.length === 0) {
        if (!isSingleMode) return buildInitialItems(nextType, preselectedLotId, lots);
        const lotId = preselectedLotId || lots[0]?.id;
        return lotId ? buildInitialItems(nextType, lotId, lots) : [];
      }

      if (isSingleMode) {
        const lotId = prev[0]?.lotId || preselectedLotId || lots[0]?.id;
        return lotId ? buildInitialItems(nextType, lotId, lots) : [];
      }

      return mapItemsForPurchaseType(prev, nextType, lots);
    });
  }

  function addItem() {
    const firstLot = lots[0];
    if (!firstLot) return;
    setItems((prev) => [
      ...prev,
      { lotId: firstLot.id, quantity: quantityForPurchaseType(purchaseType, firstLot) },
    ]);
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (field === "lotId") {
          const lot = lots.find((entry) => entry.id === value);
          return {
            lotId: value,
            quantity: lot ? quantityForPurchaseType(purchaseType, lot) : 1,
          };
        }
        return { ...item, [field]: value };
      })
    );
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const summary = useMemo(() => {
    const enriched = items.map((item) => {
      const lot = lots.find((entry) => entry.id === item.lotId);
      if (!lot) return null;
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(lot.offer?.pricePerSack || 0);
      const subtotal = quantity * unitPrice;
      return {
        lotId: lot.id,
        lotName: lot.lotName || "-",
        internalCode: lot.internalCode || "-",
        quantity,
        unitPrice,
        currency: lot.offer?.currency || "USD",
        subtotal,
        availableQuantity: Number(lot.offer?.quantityAvailable || 0),
        producerName: lot.producerName || lot.farm?.producerName || "Produtor não informado",
        producerEmail: lot.producerEmail || lot.farm?.producerEmail || "",
      };
    }).filter(Boolean);

    const itemsResumo =
      purchaseType === "multiple" ? consolidarItensCompra(enriched) : enriched;
    const { totalSacks, lotsCount, total } = calcularTotaisCompra(itemsResumo);
    const currency = itemsResumo[0]?.currency || enriched[0]?.currency || "USD";

    return { items: itemsResumo, total, currency, totalSacks, lotsCount };
  }, [items, lots, purchaseType]);

  function solicitarCompra() {
    if (summary.items.length === 0) {
      alert(t("compras.selectLotAlert"));
      return;
    }
    if (Object.keys(quantityErrors).length > 0) {
      const firstError = quantityErrors[Object.keys(quantityErrors)[0]];
      alert(firstError);
      return;
    }
    const compraId = crypto.randomUUID();
    const compraBase = {
      id: compraId,
      purchaseType,
      buyerName: usuario?.nome || "Cliente Comprador",
      buyerEmail: usuario?.email || "comprador@cafeonline.com",
      status: COMPRA_STATUS.SOLICITADA,
      createdAt: new Date().toISOString(),
      items: summary.items,
      total: summary.total,
      totalSacks: summary.totalSacks,
      lotsCount: summary.lotsCount,
      currency: summary.currency,
    };
    const compra = {
      ...compraBase,
      linkProsseguir: montarLinkProsseguir(compraBase),
    };
    salvarCompra(compra);
    setUltimaCompraId(compraId);
    setSolicitacaoEnviada(true);

    const emailDestino = summary.items[0]?.producerEmail || "leferav@gmail.com";
    const assunto =
      summary.lotsCount > 1
        ? `Solicitação de compra - ${summary.lotsCount} lotes (${summary.totalSacks} sacas)`
        : `Solicitação de compra - ${summary.items[0]?.internalCode || "Lote Café Online"}`;
    const corpo = montarCorpoEmail(compra);
    window.open(
      `mailto:${emailDestino}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`,
      "_blank"
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {solicitacaoEnviada && ultimaCompraId && (
        <div className="card" style={{ border: "1px solid #c9b5a5", background: "#faf6f2" }}>
          <h3 style={{ marginTop: 0 }}>{t("compras.requestSuccessTitle")}</h3>
          <p className="muted" style={{ marginBottom: 12 }}>{t("compras.requestSuccessText")}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn-secondary" to="/negociacoes">{t("compras.goNegociacoes")}</Link>
            <Link className="btn-outline" to={`/negociacoes?compra=${ultimaCompraId}`}>
              {t("compras.goProsseguir")}
            </Link>
          </div>
          <p className="muted" style={{ margin: "12px 0 0", fontSize: 13 }}>
            {t("compras.emailAlsoSent")}
          </p>
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>{t("compras.title")}</h2>
            <div className="muted">{t("compras.subtitle")}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn-secondary" to={ROTAS_LOTES.compra.lista}>{t("compras.backLots")}</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("compras.typeTitle")}</h3>
        <div className="btn-toggle-group">
          <button
            type="button"
            className={`btn-toggle ${purchaseType === "partial" ? "is-active" : ""}`}
            onClick={() => changePurchaseType("partial")}
          >
            {t("compras.partial")}
          </button>
          <button
            type="button"
            className={`btn-toggle ${purchaseType === "full" ? "is-active" : ""}`}
            onClick={() => changePurchaseType("full")}
          >
            {t("compras.full")}
          </button>
          <button
            type="button"
            className={`btn-toggle ${purchaseType === "multiple" ? "is-active" : ""}`}
            onClick={() => changePurchaseType("multiple")}
          >
            {t("compras.multiple")}
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{t("compras.itemsTitle")}</h3>
          {purchaseType === "multiple" && (
            <button type="button" className="btn-outline btn-sm" onClick={addItem}>{t("compras.addLot")}</button>
          )}
        </div>

        {lots.length === 0 ? (
          <p className="muted" style={{ marginTop: 16 }}>{t("compras.noLotsRegistered")}</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {items.length === 0 && (
              <button type="button" className="btn-outline" onClick={addItem} style={{ width: "fit-content" }}>
                {t("compras.selectLot")}
              </button>
            )}
            {items.map((item, index) => {
              const selectedLot = lots.find((lot) => lot.id === item.lotId);
              const available = Number(selectedLot?.offer?.quantityAvailable || 0);
              const min = Number(selectedLot?.offer?.quantityMin || 1);
              return (
                <div key={`${item.lotId}-${index}`} style={{ border: "1px solid #e7e1dc", borderRadius: 14, padding: 14, display: "grid", gap: 12 }}>
                  <div className="purchase-item-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>{t("compras.lot")}</label>
                      <select value={item.lotId} onChange={(e) => updateItem(index, "lotId", e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d9d2cb" }}>
                        {lots.map((lot) => (
                          <option key={lot.id} value={lot.id}>{lot.lotName || "-"} - {lot.internalCode || "-"}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>{t("compras.quantity")}</label>
                      <input
                        type="number"
                        min={purchaseType === "full" ? available : min}
                        max={available || undefined}
                        value={item.quantity}
                        disabled={purchaseType === "full"}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: quantityErrors[index] ? "1px solid #c44" : "1px solid #d9d2cb",
                        }}
                      />
                      {quantityErrors[index] ? (
                        <span style={{ display: "block", marginTop: 6, fontSize: 13, color: "#a33", fontWeight: 600 }}>
                          {quantityErrors[index]}
                        </span>
                      ) : null}
                    </div>
                    {purchaseType === "multiple" && (
                      <div style={{ alignSelf: "end" }}>
                        <button type="button" className="btn-ghost btn-sm" onClick={() => removeItem(index)}>{t("remove")}</button>
                      </div>
                    )}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {t("compras.minAvailable", {
                      min,
                      available,
                      currency: selectedLot?.offer?.currency || "USD",
                      price: Number(selectedLot?.offer?.pricePerSack || 0).toFixed(2),
                    })}
                  </div>
                  {purchaseType !== "full" && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#5a3e2b" }}>
                      {t("compras.availableInLot", { available })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>{t("compras.summaryTitle")}</h3>
        {summary.items.length === 0 ? (
          <p className="muted">{t("compras.noLotSelected")}</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {summary.items.map((item) => (
              <div key={item.lotId} style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                <div>
                  <strong>{item.lotName}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>{item.internalCode}</div>
                </div>
                <div>
                  {t("compras.sacksTimes", { qty: item.quantity, currency: item.currency, price: item.unitPrice.toFixed(2) })}
                </div>
                <div>
                  <strong>{item.currency} {item.subtotal.toFixed(2)}</strong>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700 }}>
              {t("compras.grandTotal", { currency: summary.currency, total: summary.total.toFixed(2) })}
            </div>
            {purchaseType === "multiple" && summary.items.length > 0 && (
              <div style={{ fontSize: 15, fontWeight: 700, color: "#5a3e2b" }}>
                {t("compras.summaryMultiple", {
                  lots: summary.lotsCount,
                  sacks: summary.totalSacks,
                })}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={solicitarCompra}
                disabled={Object.keys(quantityErrors).length > 0}
              >
                {t("compras.requestPurchase")}
              </button>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>{t("compras.mvpNote")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
