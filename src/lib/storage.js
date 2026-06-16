const KEY = "cafe_online_lots_v1";

export const LOTE_STATUS = {
  DISPONIVEL: "DISPONIVEL",
  VENDIDO: "VENDIDO",
};

export function loadLots() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function normalizarStatusLote(lot) {
  return lot?.status || LOTE_STATUS.DISPONIVEL;
}

export function isLotDisponivelParaCompra(lot) {
  if (!lot) return false;
  if (normalizarStatusLote(lot) === LOTE_STATUS.VENDIDO) return false;
  return Number(lot.offer?.quantityAvailable || 0) > 0;
}

export function loadLotsDisponiveisParaCompra() {
  return loadLots().filter(isLotDisponivelParaCompra);
}

export function saveLots(lots) {
  localStorage.setItem(KEY, JSON.stringify(lots));
}

export function upsertLot(lot) {
  const lots = loadLots();
  const idx = lots.findIndex((x) => x.id === lot.id);
  if (idx >= 0) lots[idx] = lot;
  else lots.unshift(lot);
  saveLots(lots);
  return lots;
}

export function getLotById(id) {
  return loadLots().find((x) => x.id === id) ?? null;
}

/** Reduz saldo e marca VENDIDO quando a compra é aceita. */
export function aplicarVendaLotes(items) {
  if (!items?.length) return;

  const lots = loadLots();

  for (const item of items) {
    const idx = lots.findIndex((l) => l.id === item.lotId);
    if (idx < 0) continue;

    const lot = lots[idx];
    const qtyVendida = Number(item.quantity || 0);
    const available = Number(lot.offer?.quantityAvailable || 0);
    const novaQty = Math.max(0, available - qtyVendida);

    const updated = {
      ...lot,
      offer: {
        ...lot.offer,
        quantityAvailable: novaQty,
      },
      updatedAt: new Date().toISOString(),
    };

    updated.status = novaQty <= 0 ? LOTE_STATUS.VENDIDO : LOTE_STATUS.DISPONIVEL;
    lots[idx] = updated;
  }

  saveLots(lots);
}
