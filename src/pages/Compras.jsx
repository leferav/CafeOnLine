import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadLots } from "../lib/storage";

function buildInitialItems(type, lotId, lots) {
  if (!lotId) return [];

  const selected = lots.find((lot) => lot.id === lotId);
  if (!selected) return [];

  const available = Number(selected.offer?.quantityAvailable || 0);
  const min = Number(selected.offer?.quantityMin || 1);

  return [
    {
      lotId: selected.id,
      quantity: type === "full" ? available : min,
    },
  ];
}

export default function Compras() {
  const lots = loadLots();
  const [searchParams] = useSearchParams();
  const preselectedLotId = searchParams.get("lotId") || "";

  const [purchaseType, setPurchaseType] = useState("partial");
  const [items, setItems] = useState(() => buildInitialItems("partial", preselectedLotId, lots));

  function changePurchaseType(nextType) {
    setPurchaseType(nextType);
    setItems(buildInitialItems(nextType, preselectedLotId, lots));
  }

  function addItem() {
    const firstLot = lots[0];
    if (!firstLot) return;

    setItems((prev) => [
      ...prev,
      {
        lotId: firstLot.id,
        quantity: Number(firstLot.offer?.quantityMin || 1),
      },
    ]);
  }

  function updateItem(index, field, value) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const summary = useMemo(() => {
    const enriched = items
      .map((item) => {
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
        };
      })
      .filter(Boolean);

    const total = enriched.reduce((acc, item) => acc + item.subtotal, 0);
    const currency = enriched[0]?.currency || "USD";

    return { items: enriched, total, currency };
  }, [items, lots]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Nova compra</h2>
            <div className="muted">Escolha como deseja montar o pedido.</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn-link" to="/lotes">← Lotes</Link>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Tipo de compra</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-link"
            onClick={() => changePurchaseType("partial")}
            style={{ opacity: purchaseType === "partial" ? 1 : 0.75 }}
          >
            Compra parcial
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => changePurchaseType("full")}
            style={{ opacity: purchaseType === "full" ? 1 : 0.75 }}
          >
            Lote inteiro
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => changePurchaseType("multiple")}
            style={{ opacity: purchaseType === "multiple" ? 1 : 0.75 }}
          >
            Mais de um lote
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Itens do pedido</h3>
          {purchaseType === "multiple" && (
            <button type="button" className="btn-link" onClick={addItem}>
              + Adicionar lote
            </button>
          )}
        </div>

        {lots.length === 0 ? (
          <p className="muted" style={{ marginTop: 16 }}>
            Nenhum lote cadastrado.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {items.length === 0 && (
              <button type="button" className="btn-link" onClick={addItem} style={{ width: "fit-content" }}>
                Selecionar lote
              </button>
            )}

            {items.map((item, index) => {
              const selectedLot = lots.find((lot) => lot.id === item.lotId);
              const available = Number(selectedLot?.offer?.quantityAvailable || 0);
              const min = Number(selectedLot?.offer?.quantityMin || 1);

              return (
                <div
                  key={`${item.lotId}-${index}`}
                  style={{
                    border: "1px solid #e7e1dc",
                    borderRadius: 14,
                    padding: 14,
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Lote</label>
                      <select
                        value={item.lotId}
                        onChange={(e) => updateItem(index, "lotId", e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d9d2cb" }}
                      >
                        {lots.map((lot) => (
                          <option key={lot.id} value={lot.id}>
                            {lot.lotName || "-"} - {lot.internalCode || "-"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Quantidade</label>
                      <input
                        type="number"
                        min={purchaseType === "full" ? available : min}
                        max={available || undefined}
                        value={purchaseType === "full" ? available : item.quantity}
                        disabled={purchaseType === "full"}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d9d2cb" }}
                      />
                    </div>

                    {purchaseType === "multiple" && (
                      <div style={{ alignSelf: "end" }}>
                        <button type="button" className="btn-link" onClick={() => removeItem(index)}>
                          Remover
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="muted" style={{ fontSize: 13 }}>
                    Mínimo: {min} • Disponível: {available} • Preço por saca: {selectedLot?.offer?.currency || "USD"} {Number(selectedLot?.offer?.pricePerSack || 0).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Resumo do pedido</h3>

        {summary.items.length === 0 ? (
          <p className="muted">Nenhum lote selecionado.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {summary.items.map((item) => (
              <div
                key={item.lotId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  borderBottom: "1px solid #eee",
                  paddingBottom: 10,
                }}
              >
                <div>
                  <strong>{item.lotName}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>{item.internalCode}</div>
                </div>

                <div>
                  {item.quantity} sacas × {item.currency} {item.unitPrice.toFixed(2)}
                </div>

                <div>
                  <strong>{item.currency} {item.subtotal.toFixed(2)}</strong>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700 }}>
              Total geral: {summary.currency} {summary.total.toFixed(2)}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <button type="button" className="btn-link">Continuar</button>
              <button type="button" className="btn-link">Solicitar compra</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
